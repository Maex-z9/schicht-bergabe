<script lang="ts">
  import { mockCertificates, employeeById, employeeName } from "$lib/mock";
  import { statusFor, statusLabel, daysUntil } from "$lib/types";

  // Default sort: most urgent first
  $: rows = [...mockCertificates].sort(
    (a, b) => daysUntil(a.expires_on) - daysUntil(b.expires_on)
  );
</script>

<div class="page-head">
  <h1 class="page-title">Certificates</h1>
  <a class="btn btn-primary" href="/certificates/new">Add certificate</a>
</div>

<div class="notice"><strong>Foundation preview.</strong> Mock data.</div>

<table class="table">
  <thead>
    <tr>
      <th>Certificate</th>
      <th>Type</th>
      <th>Employee</th>
      <th>Issued</th>
      <th>Expires</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {#each rows as c}
      {@const emp = employeeById(c.employee_id)}
      {@const s = statusFor(c.expires_on)}
      <tr>
        <td><strong>{c.cert_name}</strong></td>
        <td>{c.cert_type}</td>
        <td>{emp ? employeeName(emp) : "—"}</td>
        <td class="mono">{c.issued_on ?? "—"}</td>
        <td class="mono">{c.expires_on}</td>
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
