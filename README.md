# Schichtübergabe — Landing Page

Statische Landing Page für **Schichtübergabe** — ein Übergabe-Tool für
mehrsprachige Werkstätten. Reines Vanilla HTML/CSS/JS, keine
Abhängigkeiten, kein Build-Step, direkt GitHub-Pages-ready.

## Dateien

```
index.html         Deutsche Hauptseite
index.en.html      Englische Version (gleiche Struktur)
impressum.html     Impressum mit TODO-Platzhaltern
datenschutz.html   Datenschutz (DSGVO, inkl. FormSubmit-Hinweis)
css/style.css      Stylesheet
js/main.js         Sprach-Toggle (HTML-Link) + Form-Handling
assets/            Bilder/Icons (aktuell leer)
```

## Setup

### 1. Formular-Empfänger einrichten (FormSubmit)

Das Warteliste-Formular schickt Anmeldungen über
[FormSubmit](https://formsubmit.co) an
`saaslyde@zohomail.eu`. Kein Account nötig — beim ersten Submit nach
dem Go-Live kommt einmalig eine Bestätigungs-Mail von FormSubmit an
diese Adresse. Den Link in der Mail klicken, danach laufen alle
Anmeldungen still in die Inbox.

Wenn die Empfänger-Adresse geändert wird: in `index.html` und
`index.en.html` jeweils im `<form action="...">` ersetzen. Beispiel:

```bash
sed -i 's|saaslyde@zohomail.eu|neue@adresse.example|g' \
    index.html index.en.html
```

**Optional:** Nach der Verifizierung bietet FormSubmit eine gehashte
Alias-URL der Form `https://formsubmit.co/el/abcdef` an. Diese statt
der Klartext-E-Mail einsetzen, damit die Adresse nicht im öffentlichen
HTML steht.

### 2. Kontakt-E-Mail anpassen

Die `mailto:`-Adressen (`kontakt@schichtuebergabe.example`) in allen
HTML-Dateien gegen die echte Kontaktadresse austauschen.

### 3. Impressum & Datenschutz ausfüllen

In `impressum.html` und `datenschutz.html` sind alle anzupassenden
Stellen mit `<!-- TODO -->` markiert. Vor Veröffentlichung mit echten
Daten füllen und ggf. juristisch prüfen lassen.

### 4. GitHub Pages aktivieren

1. Repository auf GitHub → **Settings → Pages**
2. **Source**: `Deploy from a branch`
3. **Branch**: `main` / Root (`/`)
4. **Save** — nach 1–2 Minuten ist die Seite unter
   `https://<user>.github.io/<repo>/` erreichbar.

## Lokal testen

Kein Build nötig — einfach `index.html` im Browser öffnen oder einen
beliebigen statischen Server starten:

```bash
python3 -m http.server 8000
# dann http://localhost:8000 aufrufen
```

## Was die Seite (nicht) tut

- **Keine** Cookies, **kein** Tracking, **keine** Analyse-Tools —
  daher auch kein Cookie-Banner.
- **Keine** externen Schriften, Skripte oder CDN-Requests.
- Wartelisten-Formular geht an FormSubmit (Auftragsverarbeiter,
  in der Datenschutzerklärung erwähnt).

## Lighthouse

Ziel: 95+ in allen Kategorien. Wenn die Werte später unter 95 fallen,
fast immer durch ein Bild oder Skript verursacht, das ohne `loading="lazy"`
bzw. ohne `defer` eingebunden wurde.
