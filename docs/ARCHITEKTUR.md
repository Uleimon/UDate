# UDate – Architektur (Stand Tag 1)

## Ausgangslage
Es gab kein bestehendes Repository und keinen Code. Die Empfehlungen aus dem Auftrag (Abschnitt 14) passen
zum Produkt, darum werden sie übernommen. Bewusst **nicht** eingeführt: GraphQL, Redis, Microservices,
Kubernetes, eigene ML-Modelle. Das kommt nur, wenn es einen messbaren Grund gibt.

## Technologie-Entscheidungen

| Bereich | Wahl | Warum |
|---|---|---|
| Sprache | **TypeScript** überall | Ein Typ-System von Datenbank bis UI, geteilte Schemas zwischen Web, Mobile und API |
| Monorepo | **pnpm Workspaces** | Leicht, schnell, keine extra Build-Orchestrierung nötig |
| Backend | **Node 22 + Fastify 5**, REST unter `/v1` | Schnell, eingebaute Schema-Validierung, gute Plugins (Helmet, Rate-Limit, CORS, WebSocket) |
| Validierung | **Zod 4** (in `@udate/shared`) | Gleiche Regeln im Client und Server, Typen werden daraus abgeleitet |
| Datenbank | **PostgreSQL 16** | Relationale Daten (Likes, Matches, Chats), JSON für flexible Profilteile, Geo-Abfragen |
| ORM | **Prisma 7** (Driver-Adapter `@prisma/adapter-pg`) | Saubere Migrationen in `apps/api/prisma/migrations`, typsichere Abfragen |
| Web | **Next.js + React** (ab Tag 2) | Mobile-first Web-App, Server-Rendering für schnelle erste Ansicht |
| Mobile | **Expo / React Native** (ab Tag 19) | iOS + Android aus einer Codebasis, teilt Schemas, Design-Tokens und API-Client |
| Realtime | **WebSocket** über `@fastify/websocket` (Tag 14) | Chat, Match-Benachrichtigungen. Erst bei mehreren Servern kommt ein Pub/Sub dazu |
| Dateien | **S3-kompatibler Object Storage** (Tag 5), lokal MinIO | Privat, Auslieferung nur über kurzlebige signierte URLs |
| KI | **Austauschbare Schnittstelle** `AiProvider` (`apps/api/src/ai`) | Standard `none` = ehrlich "nicht verfügbar". Echter Anbieter ab Tag 16 |
| Tests | **Vitest** | Schnell, TypeScript ohne Umwege, gleiche Tools in allen Paketen |

## Aufbau
```
udate/
  apps/
    api/                 Fastify-Backend (REST, später WebSocket), Prisma-Schema + Migrationen
    web/                 (Tag 2) Next.js Web-App
    mobile/              (Tag 19) Expo-App
  packages/
    shared/              Vokabular (Katalog), Zod-Schemas, Typen. Von allen genutzt
    matching/            Matching-Engine: reine Funktionen, keine DB, keine KI, voll getestet
    ui/                  (Tag 2) Design-Tokens, geteilt zwischen Web und Mobile
  docs/                  AUFTRAG, ARCHITEKTUR, API, DATENSCHUTZ
  tools/                 Hilfsskripte (zip bauen)
```

### Datenfluss Matching
```
DB (Profile, Antworten, Präferenzen)
   │  Vorauswahl in SQL: aktive + sichtbare Profile, Geschlecht/Suche, grob im Umkreis, nicht blockiert, nicht schon bewertet
   ▼
toMatchProfile()  (API, Tag 11)   ── baut das MatchProfile aus @udate/shared
   ▼
@udate/matching   rankCandidates(viewer, kandidaten)
   │  1. harte Filter in BEIDE Richtungen (Suche, Alter, Radius, Ausschlusskriterien, Blockieren)
   │  2. A→B und B→A getrennt, jeweils mit der eigenen Gewichtung
   │  3. gegenseitig = harmonisches Mittel (einseitiges Interesse zieht stark runter)
   │  4. grundlegende Unterschiede (Beziehungsziel, Kinderwunsch) deckeln auf 45 %, außer beide sind flexibel
   │  5. Erklärungen "Warum könnte es passen?" / "Wo gibt es Unterschiede?" aus echten Daten
   ▼
viewFor(ergebnis, seite)  ── nur gegenseitige Werte + Sätze, die diese Person sehen darf
   ▼
API-Antwort an Web/Mobile
```

## Die Matching-Engine im Detail (`packages/matching`)
Vier Bereiche, Standard-Gewichtung wie im Auftrag (Optik 25, Persönlichkeit 35, Beziehung 25, Lebensstil 15).
Jeder Nutzer kann die Gewichtung ändern (`Profile.matchWeights`).

| Bereich | Was verglichen wird | Gerichtet? |
|---|---|---|
| Optik | Vorlieben von A (Kompass) gegen **selbst angegebene** Stil-Tags von B, plus Wunschgröße | ja |
| Persönlichkeit | Was A wichtig ist vs. was B über sich sagt (45 %), Ähnlichkeit (25 %), Nähe/Freiraum (20 %), Streitkultur (10 %) | ja |
| Beziehung | Beziehungsziele (50 %), Kinderwunsch (30 %), Wohnen (20 %) | nein |
| Lebensstil | Gemeinsame Interessen (50 %), Rauchen/Trinken (25 %), Karriere/Reiselust/Aktivität (25 %) | nein |

**Unsicherheit wird überall mitgerechnet.** Eine gelernte Vorliebe aus 1 Bewertung zählt 20 %, aus 4 Bewertungen 50 %,
aus 36 Bewertungen 90 %. Bestätigte oder selbst eingetragene Vorlieben gelten als sicher. Bereiche ohne Daten
werden weggelassen (nicht als 0 gezählt), und die App bekommt `lowConfidence`, um "Einschätzung noch unsicher" anzuzeigen.

**Datenschutz in der Engine:** `viewFor()` gibt nie die gerichteten Werte heraus, auch nicht den eigenen, weil sich
daraus mit dem gegenseitigen Wert ausrechnen ließe, wie das Gegenüber einen bewertet. Sätze über optische Vorlieben
sieht nur die Person, deren Vorlieben es sind.

## Der Attraktivitäts-Kompass (Plan, Umsetzung Tag 9–10)
- Trainingsbilder kommen **nur** aus einer eigenen, lizenzierten Sammlung (`CompassImage`): Lizenz, Model-Release
  und Volljährigkeit sind Pflichtfelder. Jedes Bild ist redaktionell mit Stil-Tags versehen (gleiche Schlüssel wie im Profil).
- Der Nutzer bewertet (5 Stufen) und kann eine Begründung schreiben. Gelernt wird aus Bewertung × Tags des Bildes,
  Begründungen verstärken einzelne Merkmale, **nachdem** der Nutzer die erkannten Merkmale bestätigt hat.
- Optische Merkmale von Profilen sind **selbst angegeben**. Es gibt keine Bildanalyse von Profilfotos, keine
  Gesichtserkennung, keine Biometrie, keine Ableitung sensibler Merkmale. Damit erfüllt der Kompass den Auftrag ohne
  die Risiken automatischer Gesichtsauswertung.
- Übersicht "Das hat dein Attraktivitäts-Kompass über dich gelernt": jede Zeile in `VisualPreference` ist sichtbar,
  bestätigbar, änderbar, löschbar. Reset löscht alle Zeilen und Bewertungen.

## Sicherheit (Grundlagen ab Tag 1)
- Konfiguration nur über Umgebungsvariablen, geprüft beim Start (`apps/api/src/config.ts`). Unsichere Werte in Produktion = kein Start.
- Helmet-Header, CORS nur für eingetragene Herkünfte, globales Rate-Limit (Login/Registrierung bekommen an Tag 3 strengere Limits).
- Fehler nach außen ohne interne Details. Logger schwärzt Passwörter, Cookies, Tokens.
- Sessions (Tag 3): serverseitig, Cookie `HttpOnly; Secure; SameSite=Lax`, in der DB nur der Hash. Passwörter mit Argon2id.
- Admin-Zugriffe auf Chats/Präferenzen nur mit Begründung, protokolliert in `AdminAuditLog` (nur anhängen).
- Löschen eines Kontos löscht per `onDelete: Cascade` alles Persönliche. Meldungen bleiben anonymisiert.

## Offene Entscheidungen (brauchen Ulei oder rechtliche Prüfung)
- **Altersverifizierung:** Tag 3 prüft das Geburtsdatum (≥ 18). Eine echte Verifizierung braucht einen Anbieter
  (z. B. Ausweis-/Video-Ident). Schnittstelle wird vorbereitet, Anbieter wählt Ulei.
- **Bildsammlung für den Kompass:** Woher kommen die lizenzierten Bilder? Ohne echte Sammlung bleibt das Training
  in der Entwicklung mit klar markierten Testbildern.
- **Hosting/Region:** Für DSGVO EU-Hosting (Datenbank + Storage + KI-Anbieter mit AV-Vertrag).
- **KI-Anbieter:** Vorschlag Claude API (Anthropic) über die vorhandene Schnittstelle, nur mit Einwilligung `AI_PROCESSING`.
