/*
  Zertifikats-Tracker — main.js
  -----------------------------
  Zwei kleine Sachen:
  1. Footer-Jahr dynamisch setzen.
  2. Warteliste-Formular per fetch an Formspree senden, Erfolg/Fehler
     inline anzeigen (kein Redirect, kein Reload).

  Formspree-Endpoint steckt im action-Attribut. Solange dort
  "DEINE_FORMULAR_ID" steht (Platzhalter aus dem Setup), blockt das
  Skript den Submit und zeigt eine sprechende Fehlermeldung.
*/

(function () {
  "use strict";

  var yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var form = document.getElementById("waitlist-form");
  if (!form) return;

  var successEl = document.getElementById("waitlist-success");
  var errorEl = document.getElementById("waitlist-error");
  var emailInput = form.querySelector('input[type="email"]');

  var msgs = {
    invalid: "Please enter a valid email address.",
    placeholder:
      "The form isn't configured yet. Please contact us directly by email.",
    network: "Something went wrong. Please try again.",
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
    if (successEl) successEl.hidden = false;
    form.hidden = true;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    hideError();

    if (!form.checkValidity()) {
      showError(msgs.invalid);
      if (emailInput && typeof emailInput.reportValidity === "function") {
        emailInput.reportValidity();
      }
      return;
    }

    var endpoint = form.getAttribute("action");
    if (!endpoint || endpoint.indexOf("DEINE_FORMULAR_ID") !== -1) {
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
          return;
        }
        // Formspree liefert bei Validierungsfehlern JSON mit "errors":
        // [{ message: "...", field: "..." }, ...]
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
      })
      .catch(function () {
        showError(msgs.network);
        if (submitBtn) submitBtn.disabled = false;
      });
  });
})();
