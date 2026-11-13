# ROADMAP – UDate (Tag für Tag)

Der große Auftrag steht in `docs/AUFTRAG.md`. Er ist hier in **Tagesportionen** geteilt, damit jeder Tag klein
genug bleibt. Die 11 Phasen aus dem Auftrag stehen jeweils dabei.

## So arbeitest du einen Tag ab (für Claude Code)
1. `CLAUDE.md` und diese Datei lesen, dann **nur den nächsten offenen Tag** machen. Nichts von späteren Tagen vorziehen.
2. Vorher den bestehenden Code des Bereichs lesen. Bestehendes wiederverwenden (Katalog/Schemas aus `@udate/shared`,
   Engine aus `@udate/matching`), nichts kaputt machen.
3. Eine Funktion ist erst fertig, wenn sie die **Fertig-Liste** unten erfüllt. Lieber eine Funktion richtig als zwei halb.
4. `pnpm build` und `pnpm test` müssen grün sein. Ab Tag 2: Web-Seiten mit Playwright im Handy-Format (390×844)
   screenshotten und den Screenshot ansehen.
5. Version in der Haupt-`package.json` hochzählen, `CHANGELOG.md` ergänzen, `pnpm zip`.
6. Hier den Tag abhaken (`[x]`) und unter "Notizen" eintragen, was offen blieb.
7. Ulei auf Deutsch in 2–3 Sätzen sagen, was neu ist und was er ausprobieren kann.

Ein Tag ist **eine** Claude-Code-Sitzung. Wird es zu groß: Rest als "Tag N b" eintragen statt durchzuziehen.

## Fertig-Liste (jede Funktion)
- Funktionierendes Frontend (ab Tag 2), Backend-Endpunkt, Datenbankanbindung.
- Eingaben mit Zod geprüft, verständliche deutsche Fehlermeldungen, keine internen Details nach außen.
- Sicherheitsprüfung: Wer darf das? Eigene Daten nur für sich selbst, Rate-Limit bei allem, was man missbrauchen kann.
- Tests (Engine/Logik: Unit-Tests, Endpunkte: `app.inject` gegen die Test-DB).
- Kein Button ohne Funktion. KI ohne Anbieter = "KI-Funktion noch nicht verfügbar".
- Mobile-first: sieht auf 390 px Breite gut aus.

## Entscheidungen, die schon feststehen
- **Android zuerst (Ulei, 13.11.2026):** Erst eine installierbare Android-APK, Web und iOS später. Neue Oberflächen
  werden zuerst in `apps/mobile` (Expo) gebaut. Die APK baut GitHub Actions (`.github/workflows/android-apk.yml`),
  sie liegt danach unter Releases (`android-v<version>`). Die Web-Tage (2, 4, 12 …) gelten sinngemäß für die App.
- TypeScript-Monorepo mit pnpm: `apps/api` (Fastify + Prisma + PostgreSQL), `apps/web` (Next.js), `apps/mobile` (Expo),
  `packages/shared`, `packages/matching`, `packages/ui`. Begründung in `docs/ARCHITEKTUR.md`.
- REST unter `/v1`, kein GraphQL. Sessions serverseitig mit HttpOnly-Cookie (Web) bzw. Bearer-Token (Mobile), kein JWT.
- Optische Merkmale von Profilen sind **selbst angegeben**. Keine automatische Bildanalyse von Profilfotos.
  Der Kompass lernt aus Bewertungen redaktionell getaggter, lizenzierter Beispielbilder.
- Matching-Werte rechnet nur `@udate/matching`. Gegenseitig = harmonisches Mittel, grundlegende Unterschiede
  (Beziehungsziel, Kinderwunsch) deckeln auf 45 %, außer beide sind flexibel. Ausschlusskriterien filtern hart.
- Keine echten Zahlungen. Premium nur als `Entitlement`-Tabelle + Feature-Flags.

---

## Tag 1 – Fundament: Architektur, Datenmodell, Matching-Engine (Phase 1)
- [x] Umgebung geprüft (kein bestehender Code), Technologie entschieden, `docs/ARCHITEKTUR.md`.
- [x] Monorepo mit pnpm, `tsconfig.base.json`, `.env.example`, `docker-compose.yml` (Postgres).
- [x] `@udate/shared`: Katalog (Eigenschaften, Bedürfnisse, Interessen, Beziehungsziele, Kinder/Wohnen, Stil-Tags,
      Kompass-Bewertungen) + Zod-Schemas (`MatchProfile`, Ausschlusskriterien, Gewichtung, optische Vorlieben).
- [x] Prisma-Schema für die ganze Plattform + erste Migration `init`.
- [x] `@udate/matching`: harte Filter, 4 Bereiche mit Unsicherheit, gerichtet + gegenseitig, Deckel, Erklärungen,
      `viewFor()` ohne gerichtete Werte, Ranking. 24 Tests.
- [x] API-Grundgerüst: Config-Prüfung, Helmet, CORS, Rate-Limit, Fehlerbehandlung, `/health`, `/health/ready`,
      `/v1/ai/status`, KI-Schnittstelle (`none`). 8 Tests.
- Version 0.1.0

## Tag 1b – Android-App vorgezogen (Phase 2, Teil 1)
- [x] `apps/mobile` mit Expo SDK 58 + Expo Router, pnpm mit `node-linker=hoisted`.
- [x] Designsystem in der App (`src/theme/tokens.ts`, `src/ui`): Farben hell/dunkel, Verläufe, Typo, Button, Karte,
      Chip, Feld, Stepper, Fortschritt, leere Zustände, Hinweise. Icons = Material Symbols (`expo-symbols`).
- [x] Navigation: Tabs Home, Entdecken, Likes, Matches, Nachrichten; Kompass, Profil, Einstellungen über Home.
- [x] Onboarding Schritt 1 + 2 (Persönliches, Dating-Vorstellungen) mit Altersprüfung ≥ 18, lokal gespeichert,
      jederzeit pausierbar. Profilansicht, Einstellungen (lokale Daten löschen, Serverstatus).
- [x] Entdecken/Likes/Matches/Chat zeigen ehrlich "braucht Server", Kompass ehrlich "noch nicht verfügbar".
- [x] GitHub Actions baut die APK und veröffentlicht sie als Release.
- Version 0.2.0

## Tag 2 – Designsystem + Web-App-Hülle (Phase 2)
> Nach "Android zuerst" später. Als Nächstes kommt Tag 3 (Konten), damit die App sich anmelden kann.
- [ ] `packages/ui`: Design-Tokens (Farben hell/dunkel, dezente Verläufe, Typografie, Abstände, Radien, Schatten,
      Bewegung). Eigene Markenidentität für UDate (Name, Farbwelt, Logo-Schriftzug als SVG).
- [ ] `apps/web` mit Next.js: Komponenten Button, Karte, Profilkarte (großes Bild), Formularfelder, Chips, Slider,
      Fortschrittsanzeige, Toast, Modal/Bottom-Sheet, Icons (ein Icon-Set, z. B. Lucide).
- [ ] Navigation mobile-first: Bottom-Bar (Home, Entdecken, Likes, Matches, Nachrichten) + Menü für Kompass,
      Profil, Einstellungen. Desktop: Seitenleiste. Seiten als leere, aber ehrliche Zustände ("Melde dich an").
- [ ] Seite `/design` zeigt alle Komponenten (nur in Entwicklung). Playwright-Screenshots 390×844 und 1280×800.
- Version 0.2.0

## Tag 3 – Konten: Registrierung, Login, Sessions (Phase 3)
- [ ] Registrierung (E-Mail, Passwort, Geburtsdatum ≥ 18, Zustimmung AGB + Datenschutz → `Consent`), Argon2id.
- [ ] E-Mail-Verifizierung mit Einmal-Token (Hash in DB, 24 h gültig). Mail-Schnittstelle: in Entwicklung Ausgabe in
      die Konsole/Datei, später SMTP-Anbieter über Umgebungsvariablen.
- [ ] Login/Logout, serverseitige Sessions, Cookie `HttpOnly; Secure; SameSite=Lax`, CSRF-Schutz für Cookie-Anfragen.
- [ ] Passwort vergessen/zurücksetzen (Token 1 h), alle Sessions beenden nach Passwortwechsel.
- [ ] Strenge Rate-Limits für Login/Registrierung/Reset, gleiche Antwort ob E-Mail existiert oder nicht.
- [ ] Tests für alle Wege inkl. Missbrauch (falsches Token, abgelaufen, doppelt benutzt, minderjährig).
- Version 0.3.0

## Tag 4 – Konten im Frontend + Kontoverwaltung (Phase 3)
- [ ] Web-Seiten: Registrieren, E-Mail bestätigen, Login, Passwort vergessen/neu.
- [ ] Einstellungen: Passwort ändern, E-Mail ändern, Einwilligungen ansehen/widerrufen.
- [ ] Konto deaktivieren (unsichtbar, reaktivierbar) und vollständig löschen (mit Bestätigung, löscht Dateien mit).
- [ ] Datenexport (DSGVO Art. 15/20): JSON mit allen eigenen Daten zum Download.
- [ ] Schnittstelle `AgeVerificationProvider` (Standard: nur Geburtsdatum, klar so gekennzeichnet).
- Version 0.4.0

## Tag 5 – Profil + Bilder (Phase 3)
- [ ] Profil bearbeiten (Anzeigename, Bio, Wohnort → gerundete Koordinaten, Größe, Sichtbarkeit je Feld).
- [ ] Bild-Upload: S3-kompatibel (lokal MinIO im docker-compose), signierte Upload-/Download-URLs,
      Typ/Größe prüfen, EXIF/GPS entfernen, Reihenfolge ändern, löschen. Max. 6 Bilder.
- [ ] Bilder starten als `PENDING` und sind erst nach Moderation öffentlich (Moderation folgt Tag 17).
- [ ] Eigene Profilvorschau "So sehen dich andere".
- Version 0.5.0

## Tag 6 – Onboarding Schritt 1–2 (Phase 4)
- [ ] Onboarding-Rahmen: Schritte mit Fortschritt, Zwischenspeichern in `OnboardingState`, jederzeit pausieren/fortsetzen.
- [ ] Schritt 1 Persönliches (Name, Geschlecht + Selbstbeschreibung, Suche, Altersbereich, Radius, Wohnort).
- [ ] Schritt 2 Dating-Vorstellungen (was suchst du, Beziehungsbild, wichtige Eigenschaften → `traitImportance`,
      Ausschlusskriterien → `dealbreakers`, "darüber kann man reden" → `flexibleOn`).
- Version 0.6.0

## Tag 7 – Persönlichkeitstest (Phase 4)
- [ ] Fragenkatalog im Code (versioniert, deutsch): Multiple Choice, Skalen, Situationsfragen, Freitext, Entweder-oder.
      Kategorien Charakter, Kommunikation, Beziehung, Freizeit. Kurz und locker formuliert, nicht klinisch.
- [ ] Auswertung Antworten → `traits`, `needs`, `conflictStyle` als nachvollziehbare Regeln (jede Frage sagt, welche
      Eigenschaft sie wie verändert). Keine Diagnosen. Freitext fließt nicht in Werte ein (nur fürs Profil, wenn freigegeben).
- [ ] UI: eine Frage pro Bildschirm, Fortschritt, überspringen erlaubt. Ergebnis "So beschreibst du dich" mit Korrekturmöglichkeit.
- Version 0.7.0

## Tag 8 – Lebensziele, Interessen, optische Vorlieben (Phase 4)
- [ ] Schritt Lebensziele (Kinder, Wohnen, Karriere, Reisen, Lebensstil, Rauchen/Trinken).
- [ ] Schritt Interessen (Chips aus dem Katalog).
- [ ] Schritt "Mein Aussehen" (eigene Stil-Tags, freiwillig) und "Optische Vorlieben" (direkt angeben → `manual`).
- [ ] Mapper `toMatchProfile()` in der API + Tests: DB → `MatchProfile`, fehlende Angaben = unbekannt.
- Version 0.8.0

## Tag 9 – Attraktivitäts-Kompass: Lernen (Phase 5)
- [ ] Verwaltung der Trainingsbilder (`CompassImage`): nur mit Lizenz, Model-Release, Volljährigkeit; Stil-Tags.
      Entwicklung: klar markierte Testbilder (z. B. Illustrationen), nie echte Fotos ohne Rechte.
- [ ] Lernalgorithmus in `@udate/matching` (oder eigenes Paket `compass`): Bewertung × Tags → Gewicht je Merkmal,
      Evidenz zählt mit, Unsicherheit wie in `preferenceConfidence`. Bestätigte/manuelle Werte überschreibt das Lernen nicht.
- [ ] Bildauswahl: abwechslungsreich, bevorzugt Merkmale mit wenig Evidenz (aktives Lernen), passend zur Suche.
- [ ] Begründung als Freitext: Nutzer wählt danach die gemeinten Merkmale per Chips aus (ohne KI). KI-Vorschlag
      der Merkmale erst ab Tag 16 und nur mit Einwilligung.
- Version 0.9.0

## Tag 10 – Attraktivitäts-Kompass: Oberfläche (Phase 5)
- [ ] Training im Swipe-artigen Kartenlayout mit 5 Bewertungsknöpfen, optionaler Begründung.
- [ ] "Das hat dein Attraktivitäts-Kompass über dich gelernt": Erkenntnisse mit Sicherheitsanzeige,
      bestätigen, korrigieren, hinzufügen, entfernen, Training wiederholen, alles zurücksetzen.
- [ ] Hinweis, dass wenige Bewertungen wenig aussagen (unter ~20 Bewertungen deutlich anzeigen).
- [ ] Einwilligung `SENSITIVE_PREFERENCES` vor dem ersten Training.
- Version 0.10.0

## Tag 11 – Matching-Engine anbinden (Phase 6)
- [ ] Kandidaten-Vorauswahl in SQL (aktiv, sichtbar, Suche passt beidseitig, Bounding-Box für Radius, nicht blockiert,
      nicht schon bewertet), dann `rankCandidates`.
- [ ] Endpunkt `GET /v1/matches/compatibility/:userId` liefert `viewFor()` (nur wenn erlaubt).
- [ ] Eigene Gewichtung einstellen (Schieberegler, Premium-frei). Erklärungen respektieren `fieldVisibility`.
- [ ] Performance-Test mit 10.000 Entwicklungs-Testprofilen (Seed, nur NODE_ENV=development).
- Version 0.11.0

## Tag 12 – Entdecken (Phase 7)
- [ ] Entdecken-Seite: große Profilkarten (Bild, Name, Alter, Entfernung, Kurzbeschreibung, Interessen, Beziehungsziel,
      Kompatibilität mit Hinweis), Profil-Detailansicht mit "Warum könnte es passen?" / "Wo gibt es Unterschiede?".
- [ ] Aktionen Like, Dislike (PASS), Favorit, Profil ansehen. Filter (Alter, Entfernung, Geschlecht, Beziehungswunsch,
      Interessen, Eigenschaften). "Keine passenden Profile mehr" statt endlos unpassender Profile.
- Version 0.12.0

## Tag 13 – Likes, Matches, Favoriten, Blockieren, Melden (Phase 7)
- [ ] Like-Ablauf: gegenseitig = Match (Transaktion, keine Doppel-Matches), Benachrichtigung je nach Sichtbarkeit.
- [ ] Listen: eingehende Likes, gesendete Likes, Favoriten, Match-Historie. Match auflösen.
- [ ] Blockieren (sofort unsichtbar in beide Richtungen, Chat weg), Melden mit Grund (→ `Report`).
- [ ] Spam-Schutz: Like-Limit pro Tag, Erkennung von Massen-Likes.
- Version 0.13.0

## Tag 14 – Chat in Echtzeit (Phase 8)
- [ ] WebSocket (`@fastify/websocket`), Auth über Session, nur Match-Partner, Nachrichten speichern, Verlauf mit Paging.
- [ ] Status gesendet/zugestellt/gelesen, Zeitstempel, Tipp-Anzeige optional, Match-Infos oben im Chat.
- [ ] Benachrichtigungen in der App (neue Nachricht, neues Match, neues Like).
- Version 0.14.0

## Tag 15 – Bildnachrichten + Sicherheit im Chat (Phase 8)
- [ ] Bildnachrichten über signierte Uploads, Schnittstelle `ImageSafetyCheck` (Standard: Bild erst nach Klick
      sichtbar + Meldeknopf; echter Prüfdienst später). Kein Bild ohne Prüfung direkt angezeigt.
- [ ] Rate-Limits für Nachrichten, Link-Warnungen, Erkennung von wiederholtem Massen-Text.
- Version 0.15.0

## Tag 16 – KI-Anbindung + Matching-Coach (Phase 9)
- [ ] `AnthropicProvider` für `AiProvider` (Claude API, Schlüssel nur aus Umgebung), Einwilligung `AI_PROCESSING`.
- [ ] Coach-Bereich: "Warum schlägt mir die KI diese Person vor?" — Antwort nur aus `viewFor()`-Daten und freigegebenen
      Profilfeldern, nie aus privaten Daten anderer. Persönliche Vorlieben zusammenfassen.
- [ ] Gesprächseinstiege im Chat auf Knopfdruck. Vorschlag wird nur ins Eingabefeld gesetzt, nie automatisch gesendet.
- [ ] Ohne Anbieter: alles sichtbar als "KI-Funktion noch nicht verfügbar". Tests mit Fake-Provider (nur in Tests).
- Version 0.16.0

## Tag 17 – Admin 1: Moderation (Phase 10)
- [ ] Admin-Bereich (eigene Rolle, eigenes Layout, 2. Faktor für Admins), Nutzerverwaltung, Profil- und Bildmoderation.
- [ ] Meldungen bearbeiten, Nutzer sperren/entsperren, Fake-Profil-Prüfung.
- [ ] Zugriff auf Chats/Präferenzen nur mit Pflicht-Begründung, alles in `AdminAuditLog`.
- Version 0.17.0

## Tag 18 – Admin 2: Statistiken + Fehlerprotokolle (Phase 10)
- [ ] Statistik: aktive Nutzer, Registrierungen, Matches, Meldungen (ohne Einzelpersonen-Daten).
- [ ] Technische Fehlerprotokolle (strukturierte Logs, ohne personenbezogene Daten).
- [ ] Schutz vor Fake-Profilen: Signale (viele Likes in kurzer Zeit, gemeldete Profile, Wegwerf-E-Mails).
- Version 0.18.0

## Tag 19 – Mobile App: Grundgerüst (Expo)
- [ ] `apps/mobile` mit Expo + Expo Router, Design-Tokens aus `packages/ui`, API-Client geteilt, Login mit Bearer-Session.
- [ ] Navigation wie Web, Entdecken + Profil.
- Version 0.19.0

## Tag 20 – Mobile App: Kernfunktionen
- [ ] Onboarding, Kompass-Training, Likes/Matches, Chat, Push-Benachrichtigungen (Expo Notifications).
- Version 0.20.0

## Tag 21 – Premium-Vorbereitung + Feinschliff
- [ ] Feature-Flags über `Entitlement` (erweiterte Filter, erweiterte Erklärungen, mehr Favoriten). Keine Zahlungen.
- [ ] Grundfunktionen bleiben kostenlos sinnvoll nutzbar (Test, der das sicherstellt).
- [ ] Animationen und Übergänge polieren, Barrierefreiheit (Kontraste, Screenreader, Tastatur).
- Version 0.21.0

## Tag 22 – Tests + Veröffentlichungsvorbereitung (Phase 11)
- [ ] End-to-End-Tests (Playwright) der Hauptwege, Last-Test Entdecken/Chat.
- [ ] Sicherheits-Review (OWASP ASVS Checkliste), Abhängigkeiten prüfen, Secrets-Scan.
- [ ] Docker-Images, Deployment-Anleitung (EU-Region), Backups, Monitoring.
- [ ] Checkliste für die rechtliche Prüfung (Datenschutzerklärung, AV-Verträge, Altersverifizierung, Impressum, AGB).
- Version 1.0.0

---

## Notizen
- **Tag 1b:** Ohne Server bleibt alles auf dem Gerät (AsyncStorage). Server-Adresse kommt beim Build über
  `app.json → expo.extra.apiUrl`. Dafür braucht es ein Hosting (offene Entscheidung). In der Cloud-Sitzung kann keine
  APK gebaut werden (Google-Server gesperrt), darum baut GitHub Actions.
- **Tag 1:** API-Tests brauchen eine laufende PostgreSQL-DB (`DATABASE_URL`). Die Engine-Tests laufen ohne DB.
  Erklärungen nutzen noch alle Felder. Ab Tag 11 müssen sie `fieldVisibility` beachten (Feld auf PRIVATE = kein Satz dazu).
  Offene Entscheidungen für Ulei stehen in `docs/ARCHITEKTUR.md` (Altersverifizierung, Bildsammlung, Hosting, KI-Anbieter).
