/*
  Certificate Tracker — main.js
  -----------------------------
  Two small things:
  1. Set footer year dynamically.
  2. Submit the waitlist form via fetch to FormSubmit (formsubmit.co)
     and show success/error inline (no redirect, no reload).

  FormSubmit endpoint lives in the form's action attribute. The path
  segment is a hash that stands in for the recipient email so it isn't
  exposed to scrapers. FormSubmit responds with HTTP 200 in both
  success and validation-error cases — distinguish via `success` in
  the JSON body. A hidden _honey field catches naive bots; we drop
  submissions that fill it.
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
  var honeyInput = form.querySelector('input[name="_honey"]');

  var msgs = {
    invalid: "Please enter a valid email address.",
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

    // Honeypot: if a bot filled the hidden field, pretend success and
    // never send anything. Real users can't see the field.
    if (honeyInput && honeyInput.value) {
      showSuccess();
      return;
    }

    var submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    var endpoint = form.getAttribute("action");
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
            // FormSubmit AJAX: { success: "true"|"false", message: "..." }
            // Coerce to boolean since they send the value as a string.
            var ok =
              resp.ok &&
              json &&
              (json.success === true ||
                json.success === "true");
            if (ok) {
              showSuccess();
              return;
            }
            var msg = (json && json.message) || msgs.network;
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
