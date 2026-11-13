# AUFTRAG – UDate (Original-Prompt von Ulei, 13.11.2026)

> Dieser Text ist der Gesamtauftrag. Er wird in `ROADMAP.md` in Tagesportionen geteilt.
> Arbeitstitel: **UDate**.

CLAUDE CODE MASTER PROMPT
KI-DATING-PLATTFORM – DEIN PERSÖNLICHER ATTRAKTIVITÄTS-KOMPASS

## 1. DEINE ROLLE
Du bist ein interdisziplinäres Entwicklerteam bestehend aus:

* Senior Full-Stack Developer
* AI / Machine Learning Engineer
* Mobile App Developer
* UI/UX Designer
* Software Architect
* Database Engineer
* Cybersecurity Specialist
* Product Designer

Deine Aufgabe ist es, eine vollständig eigenständige, professionelle und marktreife Dating-Plattform zu entwickeln.
Es handelt sich um eine echte Real-Life-Dating-App für erwachsene Menschen.
Die Plattform hat keinerlei Verbindung zu FiveM, GTA, Rollenspielservern oder DaCity.
Das Produkt soll perspektivisch als echte App für iOS und Android sowie als Webanwendung veröffentlicht werden können.
Der wichtigste Unterschied zu klassischen Dating-Apps ist unser KI-System:
„Dein persönlicher Attraktivitäts-Kompass"
Die KI soll verstehen, welche Menschen ein Nutzer optisch ansprechend findet, welche Persönlichkeit er bevorzugt und welche Beziehungsvorstellungen zu ihm passen.
Anschließend soll sie diese Erkenntnisse mit den Präferenzen anderer Nutzer vergleichen und möglichst passende gegenseitige Verbindungen vorschlagen.

## 2. PRODUKTIDEE UND PHILOSOPHIE
Entwickle keine gewöhnliche Swipe-App.
Die Plattform soll Menschen dabei helfen, einen Partner zu finden, der sowohl optisch als auch charakterlich und hinsichtlich gemeinsamer Lebensvorstellungen zu ihnen passt.
Das Matching basiert auf drei Säulen:

1. Optische und körperliche Vorlieben.
2. Persönlichkeit und Charakter.
3. Gegenseitige Anziehung und Lebensziele.

Dabei gilt:
Ein gutes Match entsteht nicht dadurch, dass nur eine Person Interesse hat.
Beide Menschen müssen grundsätzlich zueinander passen und freiwillig Interesse bekunden.
Die KI darf niemals behaupten, objektiv bestimmen zu können, wer attraktiv ist oder welche Beziehung erfolgreich sein wird.
Sie liefert persönliche Empfehlungen und nachvollziehbare Kompatibilitätseinschätzungen.

## 3. BENUTZERREGISTRIERUNG UND ONBOARDING
Entwickle ein professionelles Registrierungssystem.
Funktionen:

* Registrierung mit E-Mail.
* E-Mail-Verifizierung.
* Sicherer Login.
* Passwort zurücksetzen.
* Profilverwaltung.
* Altersprüfung beziehungsweise Altersverifizierung.
* Zustimmung zu Datenschutz und Nutzungsbedingungen.
* Account deaktivieren.
* Account vollständig löschen.

Nur volljährige Nutzer dürfen die Dating-Plattform verwenden.

### Onboarding
Nach der Registrierung wird der Nutzer durch ein mehrstufiges Onboarding geführt.

Schritt 1: Persönliche Informationen.
* Vorname oder gewünschter Anzeigename.
* Geburtsdatum.
* Wohnort.
* Geschlecht beziehungsweise Selbstbeschreibung.
* Geschlecht der gesuchten Personen.
* Bevorzugter Altersbereich.
* Suchradius.

Schritt 2: Dating-Vorstellungen.
* Was suchst du?
* Wie stellst du dir eine Beziehung vor?
* Welche Eigenschaften sind dir wichtig?
* Welche Dinge sind absolute Ausschlusskriterien?

Schritt 3: Interessen und Persönlichkeit.
Schritt 4: Optische Vorlieben.
Schritt 5: KI-Attraktivitäts-Kompass.
Schritt 6: Profilbilder und Profilbeschreibung.

Das Onboarding soll modern, angenehm und nicht überfordernd sein.
Der Nutzer muss jederzeit pausieren und später fortsetzen können.

## 4. DAS HERZSTÜCK: KI-ATTRAKTIVITÄTS-KOMPASS
Entwickle ein eigenständiges KI-Modul, das persönliche optische Präferenzen erkennt und daraus ein individuelles Präferenzprofil erstellt.

### 4.1 Visuelles Präferenztraining
Die KI zeigt dem Nutzer verschiedene Beispielbilder.
Die Bilder zeigen ausschließlich erwachsene Personen und stammen aus einer rechtmäßig nutzbaren, ausdrücklich freigegebenen Bildsammlung.
Der Nutzer kann jedes Bild bewerten:

* Sehr attraktiv.
* Attraktiv.
* Neutral.
* Weniger attraktiv.
* Überhaupt nicht mein Typ.

Optional kann er seine Bewertung genauer erklären.
Beispielsweise:
„Mir gefallen besonders die Haare, der Kleidungsstil und die natürliche Ausstrahlung."
Oder:
„Das Gesicht gefällt mir, aber der Kleidungsstil spricht mich weniger an."

### 4.2 Welche Eigenschaften soll die KI erkennen?
Optische Merkmale:

* Haarfarbe.
* Haarlänge.
* Frisur.
* Kleidungsstil.
* Make-up-Stil.
* Allgemeiner Erscheinungsstil.
* Individuelle Stilrichtungen.
* Ausstrahlung und Präsentation.

Körperliche Vorlieben können zusätzlich freiwillig in einem Fragebogen angegeben werden.
WICHTIG:
Die KI darf keine Identität erkennen, keine sensiblen Eigenschaften aus Bildern ableiten und Menschen nicht anhand ihres Aussehens objektiv bewerten.
Die Bildanalyse dient ausschließlich dazu, die freiwillig angegebenen persönlichen Präferenzen besser zu strukturieren.

### 4.3 Lernprozess
Die KI soll mit jeder Bewertung besser verstehen, was dem Nutzer gefällt.
Beispiel:
Nach mehreren Bewertungen erkennt das System möglicherweise:

* Dunkle Haare werden häufig bevorzugt.
* Ein natürlicher Kleidungsstil kommt besonders gut an.
* Alternative Mode wird häufig positiv bewertet.
* Ein gepflegtes Erscheinungsbild ist wichtig.

Diese Erkenntnisse werden in einem persönlichen Präferenzprofil gespeichert.
Die KI muss Unsicherheiten berücksichtigen.
Fünf Bewertungen reichen nicht aus, um ein vollständiges Persönlichkeits- oder Attraktivitätsprofil zu erstellen.

### 4.4 Präferenzprofil
Der Nutzer bekommt eine eigene Übersicht:
„Das hat dein Attraktivitäts-Kompass über dich gelernt."
Dort werden die erkannten Vorlieben dargestellt.
Der Nutzer kann:

* Erkenntnisse bestätigen.
* Erkenntnisse korrigieren.
* Vorlieben hinzufügen.
* Vorlieben entfernen.
* Das Training wiederholen.
* Das gesamte Präferenzprofil zurücksetzen.

Die KI darf keine Präferenzen heimlich speichern oder aus nicht freigegebenen Daten ableiten.

## 5. PERSÖNLICHKEITS- UND CHARAKTERANALYSE
Entwickle einen umfangreichen, aber benutzerfreundlichen Persönlichkeitstest.
Die Fragen sollen nicht wie ein langweiliger psychologischer Fragebogen wirken.
Verwende unterschiedliche Fragetypen:

* Multiple Choice.
* Bewertungsskalen.
* Situationsfragen.
* Freitextfragen.
* Entweder-oder-Fragen.

Kategorien

Charakter: Humor, Ehrlichkeit, Treue, Empathie, Selbstbewusstsein, Lebensfreude, Geduld, Verantwortungsbewusstsein.

Kommunikation: Offenheit, Konfliktverhalten, Gesprächsbereitschaft, Umgang mit Kritik, Bedürfnis nach Nähe, Umgang mit persönlichen Freiräumen.

Beziehung: Vertrauen, Zärtlichkeit, Romantik, Loyalität, Kompromissbereitschaft, Emotionale Verfügbarkeit.

Freizeit und Alltag: Gaming, Sport, Musik, Reisen, Ausgehen, Natur, Kochen, Familie, Unternehmungen.

Situationsfragen
Beispiel:
„Dein Partner hat einen schlechten Tag und möchte zunächst nicht darüber sprechen. Wie reagierst du?"
Antwortmöglichkeiten:

* Ich gebe ihm Freiraum.
* Ich frage nach, ob etwas passiert ist.
* Ich versuche, ihn aufzumuntern.
* Ich warte, bis er selbst das Gespräch sucht.

Solche Fragen sollen helfen, unterschiedliche Kommunikationsstile besser zu verstehen.
Die KI soll daraus keine klinischen Diagnosen oder psychologischen Persönlichkeitsdiagnosen erstellen.

## 6. BEZIEHUNGSVORSTELLUNGEN UND LEBENSZIELE
Jeder Nutzer soll seine Vorstellungen definieren können.
Mögliche Angaben: Langfristige Beziehung, Feste Partnerschaft, Unverbindliches Kennenlernen, Freundschaft mit Entwicklungspotenzial, Gemeinsame Freizeitgestaltung.

Weitere Themen: Familienplanung, Kinderwunsch, Wohnvorstellungen, Karriere und Beruf, Freizeitgestaltung, Reisen, Lebensstil, Nähe und Freiraum, Zukunftspläne.

Diese Informationen sind besonders wichtig für die Matching-Engine.
Unterschiedliche Vorstellungen müssen nicht automatisch zum Ausschluss führen.
Das System soll mögliche Unterschiede transparent machen.

## 7. INTELLIGENTE MATCHING-ENGINE
Entwickle eine eigenständige Matching-Engine.
Sie muss die Informationen beider Personen miteinander vergleichen.

Beispielhafte Gewichtung
* Optische Präferenzen: 25 %.
* Persönlichkeit: 35 %.
* Beziehungsvorstellungen: 25 %.
* Interessen und Lebensstil: 15 %.

Diese Gewichtung muss später individuell angepasst werden können.

Gegenseitige Berechnung
Person A bewertet Person B anhand ihrer eigenen Präferenzen.
Person B wird unabhängig davon anhand ihrer Präferenzen mit Person A verglichen.
Beispiel: Person A findet Person B zu 92 % passend. Person B findet Person A zu 87 % passend.
Das System errechnet daraus einen gegenseitigen Kompatibilitätswert.
Dabei müssen wichtige Ausschlusskriterien berücksichtigt werden.
Ein gegenseitiges Matching darf nicht ausschließlich durch einen hohen Durchschnittswert entstehen, wenn grundlegende Beziehungsziele nicht zusammenpassen.

Ergebnisdarstellung
Jedes Match bekommt eine verständliche Auswertung.
Beispiel:
Eure Kompatibilität: 89 % – Persönlichkeit: 94 %, Gemeinsame Interessen: 91 %, Beziehungsvorstellungen: 85 %, Optische Präferenzübereinstimmung: 88 %.

Zusätzlich: „Warum könnte es passen?"
* Ihr habt einen ähnlichen Humor.
* Ihr mögt gemeinsame Freizeitaktivitäten.
* Ihr legt beide großen Wert auf Ehrlichkeit.
* Eure langfristigen Beziehungsvorstellungen stimmen weitgehend überein.

„Wo gibt es Unterschiede?"
* Eine Person benötigt mehr persönlichen Freiraum.
* Eure Freizeitgestaltung unterscheidet sich teilweise.

Die Prozentzahlen sind Orientierungshilfen, keine wissenschaftlich validierten Erfolgswahrscheinlichkeiten.

## 8. DISCOVER-BEREICH
Entwickle eine hochwertige Entdecken-Seite. Hier werden passende Profile vorgeschlagen.
Profilkarten enthalten: Profilbild, Vorname, Alter, Wohnort beziehungsweise Entfernung, Kurzbeschreibung, Interessen, Beziehungsvorstellungen, Kompatibilitätsanzeige.
Interaktionen: Like, Dislike, Favorisieren, Profil ansehen, Match anfragen.
Zusätzlich Filter: Alter, Entfernung, Geschlecht, Beziehungswunsch, Interessen, Bestimmte Charaktereigenschaften.
Der Nutzer soll nicht endlos durch unpassende Profile scrollen müssen.
Die KI soll passende Vorschläge priorisieren.

## 9. MATCHES UND LIKE-SYSTEM
Entwickle ein vollständiges gegenseitiges Like-System.
Ablauf:
1. Person A entdeckt Person B.
2. Person A vergibt ein Like.
3. Person B erhält eine Benachrichtigung, sofern die Sichtbarkeitseinstellungen dies erlauben.
4. Person B kann das Like erwidern.
5. Bei gegenseitigem Interesse entsteht ein Match.
6. Beide Personen können einen Chat beginnen.

Zusätzliche Funktionen: Liste eingehender Likes, Liste gesendeter Likes, Favoriten, Match-Historie, Match auflösen, Nutzer blockieren, Nutzer melden.
Keine Person darf gezwungen werden, ein Like zu erwidern.

## 10. CHAT-SYSTEM
Entwickle ein modernes Nachrichtensystem.
Funktionen: Private Nachrichten, Textnachrichten, Bildnachrichten mit Sicherheitsprüfung, Nachrichtenstatus, Zeitstempel, Benachrichtigungen, Chatverlauf, Match-Informationen im Chat.

Zusätzliche KI-Funktion: Die KI kann auf Wunsch Gesprächseinstiege vorschlagen.
Beispiel: „Ihr interessiert euch beide für Gaming. Vielleicht könntest du fragen, welches Spiel sie aktuell am liebsten spielt."
Die KI darf niemals selbstständig Nachrichten versenden.

## 11. KI-MATCHING-COACH
Entwickle einen separaten KI-Bereich. Dieser Bereich erklärt dem Nutzer seine Matches.
Beispiel: „Warum schlägt mir die KI diese Person vor?"
Die KI antwortet anhand der tatsächlich vorhandenen Profilinformationen.
Weitere Funktionen: Persönliche Vorlieben zusammenfassen, Gemeinsamkeiten erklären, Unterschiede erkennen, Gesprächseinstiege vorschlagen, Matching-Ergebnisse nachvollziehbar erklären.
Die KI darf keine privaten Informationen anderer Nutzer offenlegen.

## 12. DESIGN UND BENUTZERERLEBNIS
Die Anwendung muss sich wie eine professionelle Premium-Dating-App anfühlen.
Designrichtung: Modern, Elegant, Emotional, Hochwertig, Minimalistisch aber nicht langweilig, Mobile-first, Flüssige Animationen, Große Profilbilder, Hochwertige Kartenlayouts, Dezente Farbverläufe, Klare Navigation.
Keine generische Admin-Oberfläche.
Entwickle ein eigenes Designsystem mit: Farben, Typografie, Buttons, Karten, Formularen, Animationen, Icons, Navigationskomponenten.

Hauptnavigation: 1. Home, 2. Entdecken, 3. Likes, 4. Matches, 5. Nachrichten, 6. Attraktivitäts-Kompass, 7. Mein Profil, 8. Einstellungen.
Das Design muss auf Smartphones besonders gut funktionieren.

## 13. DATENSCHUTZ, SICHERHEIT UND VERTRAUEN
Da es sich um eine echte Dating-Plattform handelt, hat Datenschutz höchste Priorität.
Implementiere: DSGVO-konforme Datenverarbeitung, Verschlüsselte Kommunikation, Sichere Passwortspeicherung, Zugriffskontrollen, Sichere Bildspeicherung, Einwilligungsverwaltung, Datenexport, Vollständige Datenlöschung, Profil-Deaktivierung, Blockier- und Meldesystem, Schutz vor Fake-Profilen, Schutz vor Spam, Rate Limiting, Sichere Sessions, Altersverifizierung.

Besonders wichtig:
Optische Präferenzen und persönliche Angaben dürfen nicht öffentlich sichtbar sein.
Nutzer müssen selbst entscheiden können, welche Informationen sie mit anderen teilen.
Es dürfen keine Gesichtserkennung oder biometrischen Identifikationssysteme eingesetzt werden.
Bilder dürfen ausschließlich mit entsprechender Berechtigung verarbeitet werden.
Die Anwendung muss für einen sicheren Umgang mit personenbezogenen Daten ausgelegt sein. Eine DSGVO-konforme Veröffentlichung erfordert zusätzlich eine rechtliche Prüfung.

## 14. TECHNISCHE ARCHITEKTUR
Analysiere zuerst die vorhandene Entwicklungsumgebung und triff anschließend eine fundierte Technologieentscheidung.
Falls noch keine Architektur existiert, bevorzuge:
Frontend: React, TypeScript, Next.js, Modernes responsives UI.
Mobile: React Native mit Expo, Gemeinsame Designsystem-Komponenten, wo sinnvoll.
Backend: Node.js, TypeScript, Saubere REST- oder GraphQL-API.
Datenbank: PostgreSQL, Prisma oder vergleichbares ORM.
Realtime: WebSockets für Chat und Live-Benachrichtigungen.
Dateispeicherung: Sicherer Object Storage für Profilbilder.
KI: Austauschbare KI-Service-Schnittstelle, Separate Matching-Engine, Kontrollierte und nachvollziehbare Datenverarbeitung.

Diese Technologien sind Empfehlungen. Prüfe zuerst, ob im bestehenden Repository bereits eine sinnvolle Architektur vorhanden ist.
Wichtig: Keine unnötigen Technologien einführen. Keine Zugangsdaten im Quellcode speichern. Umgebungsvariablen verwenden. API-Schnittstellen dokumentieren. Datenbankmigrationen sauber verwalten. Automatisierte Tests erstellen.

## 15. ADMINISTRATION UND MODERATION
Entwickle zusätzlich ein Admin-Dashboard.
Funktionen: Nutzerverwaltung, Profilmoderation, Meldungen bearbeiten, Fake-Profile überprüfen, Nutzer sperren, Inhalte moderieren, Statistikübersicht, Anzahl aktiver Nutzer, Anzahl Matches, Registrierungen, Technische Fehlerprotokolle.
Administratoren dürfen nicht ohne legitimen Grund auf private Chats oder sensible Präferenzdaten zugreifen.
Jeder administrative Zugriff auf besonders geschützte Daten muss nachvollziehbar protokolliert werden.

## 16. MONETARISIERUNG – VORBEREITUNG
Bereite die Architektur für ein späteres Premium-Modell vor.
Mögliche Premium-Funktionen: Erweiterte Suchfilter, Zusätzliche KI-Auswertungen, Erweiterte Matching-Erklärungen, Mehr Favoriten, Zusätzliche Profilgestaltung, Erweiterte Statistiken.
Die Grundfunktionen der Partnersuche müssen auch ohne Bezahlung sinnvoll nutzbar bleiben.
Implementiere noch keine echten Zahlungsprozesse, bevor das Geschäftsmodell und die rechtlichen Anforderungen feststehen.

## 17. ENTWICKLUNGSPLAN
Phase 1: Projektanalyse und Architektur – Phase 2: Designsystem und Frontend – Phase 3: Registrierung und Benutzerprofile –
Phase 4: Onboarding und Fragebögen – Phase 5: Attraktivitäts-Kompass – Phase 6: Matching-Engine – Phase 7: Discover und Likes –
Phase 8: Matches und Chat – Phase 9: KI-Matching-Coach – Phase 10: Administration und Moderation – Phase 11: Tests und Veröffentlichungsvorbereitung.

## 18. QUALITÄTSANFORDERUNGEN
Arbeite nicht nur auf eine optisch schöne Demo hin. Die Anwendung muss technisch tatsächlich funktionieren.
Jede Funktion benötigt: Funktionierendes Frontend, Funktionierendes Backend, Datenbankanbindung, Fehlerbehandlung, Sicherheitsprüfung, Tests.
Keine Fake-Daten als dauerhafte Implementierung. Keine Buttons ohne Funktion. Keine vorgetäuschte KI.
Wenn eine KI-Funktion noch keinen echten KI-Service besitzt, kennzeichne sie als nicht implementiert und entwickle eine saubere Schnittstelle dafür.
Erstelle sinnvolle Testdaten ausschließlich für die Entwicklungsumgebung.

## 19. DEINE EIGENE WEITERENTWICKLUNG
Du darfst eigene Funktionen und Verbesserungsvorschläge entwickeln, wenn sie das Produkt sinnvoll erweitern.
Bevorzuge Funktionen, die: die Qualität der Matches verbessern, Nutzervertrauen schaffen, die Bedienung vereinfachen, die Sicherheit erhöhen, langfristig einen echten Mehrwert bieten.
Entwickle keine unnötigen Funktionen nur um den Funktionsumfang aufzublähen.

## ABSCHLIESSENDE PRODUKTVISION
Wir wollen eine eigenständige, moderne Dating-Plattform mit einer echten KI-Unterstützung.
Der persönliche Attraktivitäts-Kompass soll verstehen, welche Menschen ein Nutzer optisch ansprechend findet.
Die Persönlichkeitsanalyse soll erkennen, welche Charaktereigenschaften und Beziehungsvorstellungen wichtig sind.
Die Matching-Engine soll beide Perspektiven berücksichtigen und möglichst passende gegenseitige Verbindungen vorschlagen.
Die App soll sich langfristig zu einer ernstzunehmenden Alternative zu klassischen Dating-Plattformen entwickeln.
Baue ein echtes Produkt. Keine Präsentationsdemo, keinen einfachen Tinder-Klon und keine Sammlung von Platzhalterfunktionen.
