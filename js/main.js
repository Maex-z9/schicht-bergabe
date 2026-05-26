/*
  Schichtübergabe — main.js
  -------------------------
  Macht zwei Dinge:
  1. Footer-Jahr dynamisch setzen.
  2. Warteliste-Formular per fetch an FormSubmit absenden, Erfolg/Fehler
     inline anzeigen (kein Redirect).

  Der Sprach-Toggle ist reines HTML (Link auf index.en.html) und braucht
  hier kein JS — die Spec verlangt das explizit so.

  FormSubmit antwortet auf den /ajax/-Endpoint mit JSON in der Form
  `{ success: "true", message: "..." }`. Bei Validierungsfehlern oder
  noch nicht bestätigter Empfänger-Adresse kommt `success: "false"` mit
  einer Fehlermeldung.
*/

(function () {
  "use strict";

  // Footer-Jahr
  var yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // -------- Wartelisten-Zähler (abacus.jasoncameron.dev) --------
  // Anonymer, kostenloser Counter. Beim Seitenaufruf lesen wir den
  // aktuellen Stand via GET (ohne zu inkrementieren), nach einer
  // erfolgreichen FormSubmit-Anmeldung wird via /hit bumpt.
  // Hinweis: der Endpoint ist öffentlich, theoretisch manipulierbar.
  // Für eine Pre-Launch-Liste akzeptabel; sobald wir echtes Backend
  // haben, wird das hier ersetzt.
  var COUNTER_BASE = "https://abacus.jasoncameron.dev";
  // Namespace einmal gewechselt (von "schicht-bergabe" auf "saaslyde"),
  // um den Test-Counter zurückzusetzen. abacus erlaubt /set/ und
  // /delete/ nur mit Admin-Token, den wir bei /hit/-Auto-Create nie
  // bekommen — neuer Namespace ist der pragmatische Reset auf 0.
  var COUNTER_NS = "saaslyde";
  var COUNTER_KEY = "waitlist";
  var countEl = document.getElementById("waitlist-count");
  var isEn =
    (document.documentElement.lang || "de").toLowerCase().indexOf("en") === 0;

  function renderCount(n) {
    if (!countEl || typeof n !== "number" || n < 0) return;
    if (n === 0) {
      countEl.textContent = isEn
        ? "Be the first workshop on the list."
        : "Sei die erste Werkstatt auf der Liste.";
    } else {
      var label = isEn
        ? n === 1
          ? "workshop on the list"
          : "workshops on the list"
        : n === 1
        ? "Werkstatt auf der Liste"
        : "Werkstätten auf der Liste";
      countEl.innerHTML = "<strong>" + n + "</strong> " + label;
    }
    countEl.hidden = false;
  }

  function fetchCounter(path) {
    return fetch(COUNTER_BASE + path)
      .then(function (r) {
        // 404 vom /get/-Endpoint heißt: Counter wurde noch nie gehit
        // → zählen das als 0, damit die Zeile trotzdem rendert.
        if (r.status === 404) return { value: 0 };
        if (!r.ok) {
          console.warn(
            "waitlist counter: HTTP " + r.status + " on " + path
          );
          return null;
        }
        return r.json();
      })
      .then(function (data) {
        if (data && typeof data.value === "number") renderCount(data.value);
      })
      .catch(function (err) {
        console.warn("waitlist counter: fetch failed on " + path, err);
      });
  }

  if (countEl) {
    fetchCounter("/get/" + COUNTER_NS + "/" + COUNTER_KEY);
  }

  // Reveal-on-scroll. Wir markieren die typischen Hauptblöcke (Karten,
  // Section-Heads, Hero-Visual, Pricing-/Waitlist-Karte) und blenden sie
  // beim Eintritt in den Viewport sanft ein. Wenn IntersectionObserver
  // fehlt oder der Nutzer "reduced motion" möchte, machen wir nichts —
  // die Inhalte sind dann sofort sichtbar (ohne FOUC).
  var prefersReduced = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  if (!prefersReduced && "IntersectionObserver" in window) {
    var selector =
      ".section-head, .card, .hero-visual, .pricing-card, .waitlist-card";
    var targets = document.querySelectorAll(selector);
    if (targets.length) {
      targets.forEach(function (el) {
        el.classList.add("reveal");
      });

      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );

      targets.forEach(function (el) {
        io.observe(el);
      });
    }
  }

  var form = document.getElementById("waitlist-form");
  if (!form) return;

  var successEl = document.getElementById("waitlist-success");
  var errorEl = document.getElementById("waitlist-error");
  var emailInput = form.querySelector('input[type="email"]');

  // Sprache der Fehlermeldungen aus <html lang> ableiten — Spec hat
  // zwei Sprachversionen, also halten wir die JS-Strings konsistent dazu.
  var lang = (document.documentElement.lang || "de").toLowerCase();
  var msgs =
    lang.indexOf("en") === 0
      ? {
          invalid: "Please enter a valid email address.",
          network: "Something went wrong. Please try again.",
        }
      : {
          invalid: "Bitte eine gültige E-Mail-Adresse eingeben.",
          network: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
        };

  function showError(text) {
    if (!errorEl) return;
    errorEl.textContent = text;
    errorEl.hidden = false;
  }

  function hideError() {
    if (!errorEl) return;
    errorEl.hidden = true;
    errorEl.textContent = "";
  }

  function showSuccess() {
    if (successEl) {
      successEl.hidden = false;
    }
    form.hidden = true;
    // Echten Counter bumpen — nur nach bestätigter FormSubmit-Antwort.
    fetchCounter("/hit/" + COUNTER_NS + "/" + COUNTER_KEY);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    hideError();

    // HTML5-Validierung manuell triggern, damit der Browser den nativen
    // Hinweis am Feld anzeigt — die Spec nennt required + type=email.
    if (!form.checkValidity()) {
      showError(msgs.invalid);
      if (emailInput && typeof emailInput.reportValidity === "function") {
        emailInput.reportValidity();
      }
      return;
    }

    var endpoint = form.getAttribute("action");
    var submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    var data = new FormData(form);

    fetch(endpoint, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    })
      .then(function (resp) {
        return resp
          .json()
          .catch(function () {
            return null;
          })
          .then(function (json) {
            // FormSubmit signalisiert Erfolg über HTTP 200 + success:"true".
            // String, nicht Bool — daher loose check.
            var ok = resp.ok && (!json || json.success !== "false");
            if (ok) {
              showSuccess();
              return;
            }
            var msg =
              (json && (json.message || json.error)) || msgs.network;
            showError(msg);
            if (submitBtn) submitBtn.disabled = false;
          });
      })
      .catch(function () {
        showError(msgs.network);
        if (submitBtn) submitBtn.disabled = false;
      });
  });
})();
