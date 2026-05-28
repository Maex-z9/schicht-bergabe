<script lang="ts">
  import { mockEmployees, mockCertificates, employeeName } from "$lib/mock";

  function certCount(employeeId: string): number {
    return mockCertificates.filter((c) => c.employee_id === employeeId).length;
  }
</script>

<div class="page-head">
  <h1 class="page-title">Employees</h1>
  <a class="btn btn-primary" href="/employees/new">Add employee</a>
</div>

<div class="notice"><strong>Foundation preview.</strong> Mock data.</div>

<table class="table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Employee #</th>
      <th>Department</th>
      <th>Email</th>
      <th>Certificates</th>
    </tr>
  </thead>
  <tbody>
    {#each mockEmployees as e}
      <tr>
        <td><strong>{employeeName(e)}</strong></td>
        <td class="mono">{e.employee_number ?? "—"}</td>
        <td>{e.department ?? "—"}</td>
        <td>{e.email ?? "—"}</td>
        <td class="mono">{certCount(e.id)}</td>
      </tr>
    {/each}
  </tbody>
</table>
