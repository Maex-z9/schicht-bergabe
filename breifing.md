## Landing Page Build-Spec

Stack: Vanilla HTML/CSS/JS. Keine Frameworks, kein Build-Step. Direkt GitHub-Pages-ready.

Dateien:
- index.html (Hauptseite, Deutsch)
- index.en.html (Englisch-Version, gleiche Struktur)
- impressum.html (Platzhalter mit TODO-Kommentaren)
- datenschutz.html (DSGVO-konform, Formspree-Hinweis enthalten)
- /css/style.css
- /js/main.js (nur Sprach-Toggle + Form-Handling)
- /assets/ (leerer Ordner für Bilder/Icons)
- README.md (Setup-Anleitung: Formspree-URL ersetzen, GitHub Pages aktivieren)

Design-Richtlinien:
- Mobile-first, sauber, industrielle Anmutung
- Farben: Stahlblau (#1E3A5F) als Akzent, Grautöne (#F5F5F5, #2C2C2C), Weiß
- Schrift: System-Font-Stack (kein Google Fonts, keine externen Requests)
- Viel Weißraum, klare Hierarchie, keine Stock-Photo-Optik
- CSS-Mockup für Feature-Section: schlichte Karten mit Icon (SVG inline) + Titel + 1-Satz-Beschreibung

Sections (in dieser Reihenfolge):
1. Hero: H1 "Schichtübergabe für mehrsprachige Werkstätten" / Sub "Schluss mit Zettelwirtschaft. Jeder schreibt in seiner Sprache, jeder liest in seiner." / CTA-Button scrollt zu #warteliste
2. Problem: 4 Pain Points als Karten (Zettel verschwinden / Sprachbarrieren / Werkzeug-Chaos / Wissen geht verloren)
3. Lösung: 6 Features als Karten mit Inline-SVG-Icons
4. Über: Kurztext Gründer (Zerspaner 8 Jahre + IT) – baut Vertrauen
5. Pricing-Teaser: "Ab 39 €/Monat pro Standort – Frühe Nutzer: 50% im ersten Jahr"
6. Warteliste (#warteliste): E-Mail-Formular, Formspree-Endpoint als Platzhalter `FORMSPREE_URL_HIER`, Erfolgsmeldung inline (kein Redirect), Hinweis "Erste 20 Kunden: 50% Rabatt + persönliches Onboarding"
7. Footer: Links zu Impressum, Datenschutz, mailto-Kontakt

Sprach-Toggle:
- Oben rechts fixed, Buttons "DE | EN"
- Wechsel via Link auf index.en.html (kein JS-i18n nötig, hält es simpel)

Form-Verhalten:
- E-Mail-Input + Submit-Button
- Bei Submit: fetch POST zu Formspree, Success-Message inline anzeigen, Form ausblenden
- Bei Fehler: Fehlermeldung anzeigen
- HTML5-Validierung (required, type=email)

Compliance:
- Keine Tracking-Cookies, kein Analytics → kein Cookie-Banner
- Impressum & Datenschutz verlinkt im Footer
- Datenschutz-Seite erwähnt Formspree als Auftragsverarbeiter

Performance:
- Inline-CSS für above-the-fold okay, sonst extern
- Keine externen Skripte/Fonts/Trackers
- Lighthouse-Ziel: 95+ in allen Kategorien
