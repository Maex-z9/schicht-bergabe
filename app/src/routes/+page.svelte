<script lang="ts">
  import { mockCertificates, employeeById, employeeName } from "$lib/mock";
  import { statusFor, statusLabel, daysUntil } from "$lib/types";

  $: counts = {
    total: mockCertificates.length,
    expired: mockCertificates.filter(
      (c) => statusFor(c.expires_on) === "expired"
    ).length,
    crit: mockCertificates.filter((c) => statusFor(c.expires_on) === "crit")
      .length,
    soon: mockCertificates.filter((c) => statusFor(c.expires_on) === "soon")
      .length,
  };

  // Sort by expiry ascending so the most urgent rows are at the top.
  $: rows = [...mockCertificates].sort(
    (a, b) => daysUntil(a.expires_on) - daysUntil(b.expires_on)
  );
</script>

<div class="page-head">
  <h1 class="page-title">Dashboard</h1>
  <a class="btn btn-primary" href="/certificates/new">Add certificate</a>
</div>

<div class="notice">
  <strong>Foundation preview.</strong> Showing mock data. Real data
  arrives once Supabase is wired up (next session).
</div>

<div class="stats">
  <div class="stat">
    <div class="stat-label">Total certificates</div>
    <div class="stat-value">{counts.total}</div>
  </div>
  <div class="stat">
    <div class="stat-label">Expired</div>
    <div class="stat-value crit">{counts.expired}</div>
  </div>
  <div class="stat">
    <div class="stat-label">Critical (≤ 14 days)</div>
    <div class="stat-value crit">{counts.crit}</div>
  </div>
  <div class="stat">
    <div class="stat-label">Expiring soon (≤ 30 days)</div>
    <div class="stat-value soon">{counts.soon}</div>
  </div>
</div>

<h2>Upcoming and overdue</h2>

<table class="table">
  <thead>
    <tr>
      <th>Certificate</th>
      <th>Employee</th>
      <th>Expires</th>
      <th>Remaining</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {#each rows as c}
      {@const emp = employeeById(c.employee_id)}
      {@const s = statusFor(c.expires_on)}
      {@const d = daysUntil(c.expires_on)}
      <tr>
        <td>
          <strong>{c.cert_name}</strong>
        </td>
        <td>{emp ? employeeName(emp) : "—"}</td>
        <td class="mono">{c.expires_on}</td>
        <td class="mono">
          {#if d < 0}
            {-d} days overdue
          {:else}
            in {d} days
          {/if}
        </td>
        <td>
          <span
            class="status {s === 'ok'
              ? 'status-ok'
              : s === 'soon'
                ? 'status-soon'
                : 'status-crit'}"
          >
            {statusLabel(s)}
          </span>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
