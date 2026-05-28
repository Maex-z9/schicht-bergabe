<script lang="ts">
  import { mockEmployees, employeeName } from "$lib/mock";
</script>

<div class="page-head">
  <h1 class="page-title">Add certificate</h1>
  <a class="btn btn-ghost" href="/certificates">Cancel</a>
</div>

<div class="notice">
  <strong>Foundation preview.</strong> Form layout only — submission
  arrives once Supabase is wired up.
</div>

<form style="max-width: 540px;">
  <div class="form-row">
    <label for="employee">Employee</label>
    <select id="employee" required>
      <option value="" disabled selected>Select employee…</option>
      {#each mockEmployees as e}
        <option value={e.id}>{employeeName(e)}</option>
      {/each}
    </select>
  </div>

  <div class="form-row">
    <label for="cert_type">Type</label>
    <select id="cert_type" required>
      <option value="" disabled selected>Select type…</option>
      <option value="license">License</option>
      <option value="training">Training</option>
      <option value="medical">Medical / fitness check</option>
      <option value="other">Other</option>
    </select>
  </div>

  <div class="form-row">
    <label for="cert_name">Certificate name</label>
    <input id="cert_name" type="text" required placeholder="e.g. Forklift license G25" />
  </div>

  <div class="form-row">
    <label for="issued_on">Issued on (optional)</label>
    <input id="issued_on" type="date" />
  </div>

  <div class="form-row">
    <label for="expires_on">Expires on</label>
    <input id="expires_on" type="date" required />
  </div>

  <div class="form-row">
    <label for="notes">Notes (optional)</label>
    <textarea id="notes" rows="3"></textarea>
  </div>

  <button class="btn btn-primary" type="button" disabled>
    Save (disabled in foundation)
  </button>
</form>
