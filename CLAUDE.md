# UDate – Dating-Plattform mit persönlichem Attraktivitäts-Kompass

Echte Real-Life-Dating-App für Erwachsene. **Android zuerst**, Web und iOS später. **Kein Bezug zu FiveM, GTA, DaCity.**
Besonderheit: der "Attraktivitäts-Kompass" lernt persönliche optische Vorlieben, dazu Persönlichkeit und
Lebensziele, und eine eigene Matching-Engine schlägt **gegenseitig** passende Menschen vor.

Besitzer: Ulei. **Antworten an Ulei auf Deutsch**, kurz und einfach. Der Gesamtauftrag steht in `docs/AUFTRAG.md`.

## Wie es weitergeht
**Erst `ROADMAP.md` lesen.** Dort ist der Auftrag in Tage geteilt. Pro Sitzung nur den nächsten offenen Tag
("mach den nächsten Tag"), dann testen, abhaken, Version hochzählen, `CHANGELOG.md` ergänzen, zip bauen.

## Ordner
```
apps/api/                Fastify-Backend (TypeScript, ESM)
  prisma/schema.prisma   Datenmodell (alle Tabellen, kommentiert). Migrationen in prisma/migrations
  prisma.config.ts       Prisma 7 Konfiguration (liest apps/api/.env)
  src/config.ts          Umgebungsvariablen mit Zod geprüft, unsichere Produktionswerte = kein Start
  src/app.ts             buildApp(deps): Helmet, CORS, Rate-Limit, Fehlerbehandlung, Routen
  src/server.ts          Startpunkt
  src/routes/*.ts        Routen (je Bereich eine Datei, als Fastify-Plugin)
  src/ai/provider.ts     Austauschbare KI-Schnittstelle. Standard "none" = ehrlich nicht verfügbar
  src/lib/               db (Prisma-Client mit pg-Adapter), errors (AppError)
  src/generated/prisma   von `prisma generate` erzeugt, nicht bearbeiten, nicht im zip
packages/shared/         Katalog (alle Schlüssel + deutsche Labels) und Zod-Schemas, z. B. MatchProfile
packages/matching/       Matching-Engine: reine Funktionen, keine DB, keine KI
  src/filters.ts         harte Filter in beide Richtungen
  src/pillars.ts         die 4 Bereiche (Optik, Persönlichkeit, Beziehung, Lebensstil) mit Unsicherheit
  src/compatibility.ts   gerichtet + gegenseitig, Deckel, Erklärungen, viewFor() = was eine Person sehen darf
  src/ranking.ts         Sortierung für Entdecken
apps/mobile/             Android-App (Expo SDK 58, Expo Router, React Native). Android zuerst!
  app.json               Name, Paket de.udate.app, Version, extra.apiUrl (Server-Adresse, leer = kein Server)
  src/app/               Bildschirme (Expo Router): (tabs)/ = untere Leiste, onboarding, kompass, profil, einstellungen
  src/ui/index.tsx       Designsystem-Komponenten, src/theme/tokens.ts = Farben/Abstände/Schrift
  src/lib/               onboarding (Zwischenstand, AsyncStorage), server (Health-Check), age, config
docs/                    AUFTRAG (Original-Prompt), ARCHITEKTUR (Entscheidungen), API (Endpunkte)
tools/make_zip.py        baut dist/udate_<version>.zip
```

## Befehle
- Einmalig: `pnpm install`, `cp .env.example apps/api/.env`, Datenbank starten (`docker compose up -d db`
  oder lokales PostgreSQL mit User/DB `udate`), dann `pnpm db:deploy`.
- `pnpm build` baut alles, `pnpm test` baut die Pakete und testet alles (API-Tests brauchen die DB).
- `pnpm dev:api` startet die API auf Port 4000 (`/health`, `/health/ready`, `/v1/ai/status`).
- Schema geändert: `pnpm db:migrate` (fragt nach Namen, erzeugt Migration). Migrationen nie von Hand ändern, wenn schon ausgeliefert.
- `pnpm zip` baut die Lieferung.
- App: `pnpm --filter @udate/mobile typecheck`, Bundle-Test `cd apps/mobile && npx expo export --platform android`.
  Pakete für die App mit den Versionen aus `node_modules/expo/bundledNativeModules.json` eintragen
  (`expo install` geht in der Cloud-Sitzung nicht, weil api.expo.dev gesperrt ist).
- **APK:** Push auf `main` → GitHub Actions „Android APK“ → Release `android-v<version>` mit `UDate-<version>.apk`.
  Vor dem Push `version` in `apps/mobile/app.json` und `android.versionCode` hochzählen.

## Regeln (nicht verhandelbar)
- **Nur Erwachsene.** Alter ≥ 18 wird serverseitig geprüft (`MIN_AGE` in shared). Kompass-Bilder nur mit
  Lizenz, Model-Release und nachgewiesener Volljährigkeit.
- **Keine Gesichtserkennung, keine Biometrie, keine Identitätserkennung.** Keine Ableitung sensibler Merkmale
  (Herkunft, Religion, Gesundheit, Orientierung usw.) aus Bildern oder Texten. Optische Merkmale von Profilen sind
  **selbst angegebene** Stil-Tags aus dem Katalog. Neue Merkmale nur Stil/Präsentation, nie sensible Kategorien.
- **Keine vorgetäuschte KI.** Was keinen echten KI-Dienst hat, zeigt "KI-Funktion noch nicht verfügbar".
  Matching-Werte rechnet die Engine, nie ein Sprachmodell. Die KI sendet nie selbst Nachrichten.
- **Keine objektive Attraktivität.** Texte sagen "passt zu deinen Vorlieben", nie "ist attraktiv". Jede Prozentzahl
  zeigt den Hinweis `SCORE_DISCLAIMER`.
- **Datenschutz:** Präferenzen und persönliche Angaben nie öffentlich. An Clients nur `viewFor()`-Ergebnisse,
  nie gerichtete Werte. Nutzer entscheiden über `fieldVisibility`, was andere sehen. Admin-Zugriff auf Chats/Präferenzen
  nur mit Begründung + `AdminAuditLog`.
- **Keine Zugangsdaten im Code.** Alles über Umgebungsvariablen, neue Variablen in `.env.example` und `config.ts`.
- **Jede Funktion komplett:** Frontend + Backend + DB + Fehlerbehandlung + Sicherheitsprüfung + Tests.
  Keine Buttons ohne Funktion, keine Fake-Daten außer markierten Entwicklungs-Testdaten (Seed nur bei NODE_ENV=development).
- Neue Endpunkte in `docs/API.md` eintragen. Eingaben immer mit Zod-Schemas aus `@udate/shared` prüfen.
- Keine neuen Technologien ohne Grund (kein Redis, GraphQL, Microservices usw., solange es nicht nötig ist).
- Bei jeder Lieferung `version` in der Haupt-`package.json` hochzählen (0.1.0 → 0.2.0 pro Tag).

## Umgebung
- Node 22, pnpm 10, PostgreSQL 16, Prisma 7.10 (Driver-Adapter, Client wird nach `src/generated/prisma` erzeugt).
- Vitest für alle Tests. Die Pakete werden als ESM mit `.js`-Endungen in Imports geschrieben (NodeNext).

## Offen
- Echte Altersverifizierung (Anbieter), lizenzierte Bildsammlung für den Kompass, Hosting-Region, KI-Anbieter:
  Entscheidungen von Ulei, siehe `docs/ARCHITEKTUR.md` → Offene Entscheidungen.
- DSGVO: Technik wird datensparsam gebaut, für die Veröffentlichung ist eine rechtliche Prüfung nötig.
