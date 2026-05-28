<div style="min-height: 100vh; display: grid; place-items: center; padding: 32px;">
  <div
    style="
      background: var(--c-bg-card);
      border: 1px solid var(--c-rule);
      border-radius: var(--radius);
      padding: 36px 32px;
      max-width: 380px;
      width: 100%;
    "
  >
    <h1 style="font-size: 1.5rem; margin-bottom: 6px;">Sign in</h1>
    <p style="color: var(--c-ink-muted); margin-bottom: 24px;">
      Certificate Tracker
    </p>

    <div class="notice">
      <strong>Foundation preview.</strong> Email/password and magic-link
      sign-in arrive once Supabase is wired up.
    </div>

    <form>
      <div class="form-row">
        <label for="email">Email</label>
        <input id="email" type="email" autocomplete="email" required />
      </div>
      <div class="form-row">
        <label for="password">Password</label>
        <input id="password" type="password" autocomplete="current-password" required />
      </div>
      <button class="btn btn-primary" type="button" disabled style="width: 100%;">
        Sign in (disabled in foundation)
      </button>
    </form>
  </div>
</div>
