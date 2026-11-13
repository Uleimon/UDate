# UDate – API

Basis-URL lokal: `http://localhost:4000`. Fachliche Endpunkte liegen unter `/v1`.
Fehler haben immer die Form `{ "error": "<code>", "message": "<deutscher Text>" }` (bei Validierung zusätzlich `issues`).

| Methode | Pfad | Auth | Beschreibung |
|---|---|---|---|
| GET | `/health` | – | Prozess lebt: `{ status: "ok" }` |
| GET | `/health/ready` | – | Datenbank erreichbar: `{ status: "ok", db: "ok" }`, sonst 503 |
| GET | `/v1/ai/status` | – | `{ available, provider, reason }`. Die App zeigt bei `available=false` "KI-Funktion noch nicht verfügbar" |

Fehlercodes: `validation` (400), `bad_request` (400), `forbidden` (403), `not_found` (404), `ai_unavailable` (503), `internal` (500).

Neue Endpunkte hier eintragen (Pfad, Auth, Eingabe-Schema aus `@udate/shared`, Antwort, Fehlercodes).
