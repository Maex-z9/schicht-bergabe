# Zertifikats-Tracker — Landing Page

Statische Landing Page für **Zertifikats-Tracker** — ein Compliance-Tool,
mit dem Betriebe ablaufende Zertifikate, Lizenzen und Pflichtschulungen
ihrer Mitarbeiter verwalten. Reines Vanilla HTML/CSS/JS, keine
Abhängigkeiten, kein Build-Step, direkt GitHub-Pages-ready.

## Dateien

```
index.html         Landing Page (Deutsch, Single Page)
impressum.html     Impressum mit TODO-Platzhaltern
datenschutz.html   Datenschutz (DSGVO, inkl. Formspree-Hinweis)
css/style.css      Stylesheet (mit @font-face für IBM Plex)
js/main.js         Form-Handler + Footer-Jahr
assets/fonts/      IBM Plex Serif / Sans / Mono (WOFF2, OFL-lizenziert)
assets/og.png      Open-Graph-Bild (1200×630)
sitemap.xml        Sitemap
robots.txt         Robots
```

## Setup

### 1. Formspree-Form-ID einsetzen

Auf [formspree.io](https://formspree.io) ein neues Formular anlegen und
die Endpoint-URL kopieren (Format: `https://formspree.io/f/abcd1234`).
Anschließend in `index.html` den Platzhalter ersetzen:

```bash
sed -i 's|DEINE_FORMULAR_ID|abcd1234|g' index.html
```

Alternativ im Editor `DEINE_FORMULAR_ID` durch deine echte ID austauschen.

Solange der Platzhalter drinsteht, blockt `js/main.js` den Submit und
zeigt eine sprechende Fehlermeldung — verhindert kaputte POSTs während
der Entwicklung.

### 2. Kontakt-E-Mail anpassen

Die `mailto:`-Adressen (`saaslyde@zohomail.eu`) in allen HTML-Dateien
gegen die echte Kontaktadresse austauschen, falls nötig.

### 3. Impressum & Datenschutz ausfüllen

In `impressum.html` und `datenschutz.html` sind alle anzupassenden
Stellen mit `<!-- TODO -->` markiert. Vor Veröffentlichung mit echten
Daten füllen und ggf. juristisch prüfen lassen.

### 4. GitHub Pages

Repo → **Settings → Pages** → Source `main` / Root. Die Seite ist dann
unter `https://<user>.github.io/<repo>/` bzw. `https://saaslyde.org/`
(Custom Domain) erreichbar.

## Lokal testen

Kein Build nötig — beliebigen statischen Server starten:

```bash
python3 -m http.server 8000
# dann http://localhost:8000 aufrufen
```

Oder `index.html` direkt im Browser öffnen.

## Was die Seite (nicht) tut

- **Keine** Cookies, **kein** Tracking, **keine** Analyse-Tools — daher
  auch kein Cookie-Banner.
- **Keine** externen Schriften, Skripte oder CDN-Requests im Live-Betrieb.
  IBM Plex liegt lokal in `assets/fonts/`.
- Wartelisten-Formular geht an Formspree (Auftragsverarbeiter, in der
  Datenschutzerklärung erwähnt).

## Fonts

IBM Plex Serif/Sans/Mono in `assets/fonts/`, OFL-lizenziert (Open Font
License). Quelle: <https://github.com/IBM/plex>. Insgesamt sechs WOFF2,
~380 KB.
