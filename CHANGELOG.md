# UDate – Änderungen

## 0.2.0 – Android-App (13.11.2026)
- Erste Android-App (Expo): eigenes Design hell/dunkel, untere Navigation, Home mit Fortschritt.
- Onboarding Schritt 1 und 2 mit Altersprüfung, Ausschlusskriterien und „darüber kann man reden“, jederzeit pausierbar.
- Profilansicht, Einstellungen mit „Alle Angaben löschen“. Bereiche, die einen Server brauchen, sagen das offen.
- APK wird automatisch von GitHub Actions gebaut und als Release bereitgestellt.

## 0.1.0 – Tag 1: Fundament (13.11.2026)
- Architektur festgelegt (TypeScript-Monorepo: Fastify-API, PostgreSQL/Prisma, später Next.js + Expo), siehe `docs/ARCHITEKTUR.md`.
- Datenmodell für die ganze Plattform mit erster Migration (Konten, Sessions, Einwilligungen, Profile, Bilder,
  Onboarding, Persönlichkeit, Kompass, Likes, Matches, Chat, Meldungen, Admin-Protokoll, Premium-Vorbereitung).
- Matching-Engine `@udate/matching`: gegenseitige Berechnung, Ausschlusskriterien, Deckel bei grundlegenden
  Unterschieden, Unsicherheit, Erklärungen, Datenschutz-Ansicht. 24 Tests.
- API-Grundgerüst: Konfiguration aus Umgebungsvariablen, Sicherheits-Header, Rate-Limit, Health-Checks,
  ehrliche KI-Statusanzeige ("noch nicht verfügbar").
