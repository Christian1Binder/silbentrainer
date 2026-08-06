# Silbenhelden

Silbenhelden ist eine kostenlose, iPad-optimierte Web-App zum Trainieren des Lesens mit Silben. Die App läuft vollständig im Browser und speichert Lernstände ausschließlich lokal auf dem verwendeten Gerät.

## Funktionen

- 150 vorbereitete Sätze in drei Schulstufen
- 15 Lernpfade mit jeweils zehn Aufgaben
- adaptiver Trainer, der die Schwierigkeit an den Lernstand anpasst
- Wiederholsystem mit Intervallen von 1, 3, 7, 14, 30 und 60 Tagen
- Fehleranalyse für häufig vertauschte Silben
- Sterne, XP, Kristalle, Pokale, Medaillen und Wochenmissionen
- auswählbare Lernbegleiter und freischaltbare Accessoires
- Fortschrittsansicht mit Lernstufen, Trainingszeit und Sieben-Tage-Aktivität
- Lehrerbereich für direkte Trainingslinks und QR-Codes
- Editor für eigene silbierte Übungssätze mit JSON-Import und -Export
- Vorlesefunktion über die Sprachausgabe des Geräts
- installierbare Progressive Web App mit Offline-Modus
- Drag-and-drop und alternative Touch-Bedienung durch Antippen

## Lernpfade

### Grundschule

1. Silben entdecken
2. Wörter bauen
3. Sätze verstehen
4. Längere Wörter
5. Flüssig lesen

### Sekundarstufe

1. Mehrsilbige Wörter
2. Handlungen erkennen
3. Längere Sätze
4. Fachwörter im Alltag
5. Sicherer Lesefluss

### Oberstufe

1. Fachsprache
2. Quellen und Argumente
3. Sprache und Gesellschaft
4. Analyse und Methoden
5. Schlussfolgerungen

## Datenschutz

Die App besitzt kein Benutzerkonto und sendet keine Lernstände an einen Server. Fortschritte, eigene Übungen und Einstellungen werden über `localStorage` im jeweiligen Browser gespeichert. Der Export im Fortschrittsbereich erzeugt eine lokale JSON-Datei.

Der QR-Code im Lehrerbereich enthält lediglich den ausgewählten Lernpfad, die Aufgabenzahl und einen frei wählbaren Auftragscode. Es werden keine Schülerdaten eingebettet.

## Eigene Übungen

Mehrsilbige Wörter werden mit Bindestrichen getrennt. Jede Zeile entspricht einer Aufgabe:

```text
Die Feu-er-wehr löscht den Brand.
Das gro-ße Fahr-zeug fährt sehr schnell.
```

Die gespeicherten Übungspakete können als JSON-Datei exportiert und auf einem anderen Gerät wieder importiert werden.

## GitHub Pages

1. Repository-Einstellungen öffnen.
2. Unter **Pages** die Quelle **Deploy from a branch** auswählen.
3. Branch `main` und Ordner `/root` einstellen.
4. Speichern.

Die App ist anschließend unter `https://christian1binder.github.io/silbentrainer/` erreichbar.
