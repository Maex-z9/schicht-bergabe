/*
  Schichtübergabe — main.js
  -------------------------
  Macht zwei Dinge:
  1. Footer-Jahr dynamisch setzen, damit das Copyright nicht veraltet.
  2. Warteliste-Formular per fetch an Formspree absenden, Erfolg/Fehler
     inline anzeigen (kein Redirect).

  Der Sprach-Toggle ist reines HTML (Link auf index.en.html) und braucht
  hier kein JS — die Spec verlangt das explizit so.

  Annahme: Der Formspree-Endpoint wird vor dem Deploy von Hand im
  data-action / action-Attribut ersetzt. Solange der Platzhalter
  "FORMSPREE_URL_HIER" drinsteht, schicken wir keinen Request raus
  und zeigen stattdessen eine sprechende Fehlermeldung — verhindert
  einen kaputten POST-Versuch in der Entwicklung.
*/

(function () {
  "use strict";

  // Footer-Jahr
  var yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
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
          placeholder:
            "The form isn't configured yet. Please email us directly.",
          network: "Something went wrong. Please try again.",
        }
      : {
          invalid: "Bitte eine gültige E-Mail-Adresse eingeben.",
          placeholder:
            "Das Formular ist noch nicht konfiguriert. Bitte direkt per E-Mail melden.",
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
    if (!endpoint || endpoint.indexOf("FORMSPREE_URL_HIER") !== -1) {
      showError(msgs.placeholder);
      return;
    }

    var submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    var data = new FormData(form);

    fetch(endpoint, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    })
      .then(function (resp) {
        if (resp.ok) {
          showSuccess();
        } else {
          // Formspree liefert bei Validierungsfehlern JSON mit "errors".
          return resp
            .json()
            .catch(function () {
              return null;
            })
            .then(function (json) {
              var msg = msgs.network;
              if (json && json.errors && json.errors.length) {
                msg = json.errors
                  .map(function (err) {
                    return err.message || "";
                  })
                  .filter(Boolean)
                  .join(" ");
              }
              showError(msg || msgs.network);
              if (submitBtn) submitBtn.disabled = false;
            });
        }
      })
      .catch(function () {
        showError(msgs.network);
        if (submitBtn) submitBtn.disabled = false;
      });
  });
})();
