/*
  Mock-Daten für die Foundation-Session — wird in der nächsten Session
  durch echte Supabase-Queries ersetzt. Daten sind absichtlich konkret
  (echte Zertifikatstypen, deutsche Personen-Namen, plausible
  Ablaufdaten), damit das UI realistisch aussieht.
*/

import type { Employee, Certificate } from "./types";

const today = new Date();
function addDays(days: number): string {
  const d = new Date(today);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const ORG = "demo-org";

export const mockEmployees: Employee[] = [
  {
    id: "e1",
    organization_id: ORG,
    first_name: "Markus",
    last_name: "Kowalski",
    employee_number: "2034",
    email: "markus.kowalski@example.com",
    department: "Production",
    active: true,
    created_at: "",
  },
  {
    id: "e2",
    organization_id: ORG,
    first_name: "Anna",
    last_name: "Liebermann",
    employee_number: "1218",
    email: "anna.liebermann@example.com",
    department: "Quality Assurance",
    active: true,
    created_at: "",
  },
  {
    id: "e3",
    organization_id: ORG,
    first_name: "Tomek",
    last_name: "Wojcik",
    employee_number: "0871",
    email: "tomek.wojcik@example.com",
    department: "Production",
    active: true,
    created_at: "",
  },
  {
    id: "e4",
    organization_id: ORG,
    first_name: "Sofia",
    last_name: "Rossi",
    employee_number: "0445",
    email: "sofia.rossi@example.com",
    department: "Maintenance",
    active: true,
    created_at: "",
  },
];

export const mockCertificates: Certificate[] = [
  {
    id: "c1",
    organization_id: ORG,
    employee_id: "e1",
    cert_type: "license",
    cert_name: "Forklift license G25",
    issued_on: addDays(-700),
    expires_on: addDays(412),
    notes: null,
    created_at: "",
  },
  {
    id: "c2",
    organization_id: ORG,
    employee_id: "e2",
    cert_type: "training",
    cert_name: "FFP3 mask training",
    issued_on: addDays(-340),
    expires_on: addDays(22),
    notes: null,
    created_at: "",
  },
  {
    id: "c3",
    organization_id: ORG,
    employee_id: "e3",
    cert_type: "training",
    cert_name: "First-aid training",
    issued_on: addDays(-720),
    expires_on: addDays(4),
    notes: null,
    created_at: "",
  },
  {
    id: "c4",
    organization_id: ORG,
    employee_id: "e4",
    cert_type: "license",
    cert_name: "Crane operator license",
    issued_on: addDays(-180),
    expires_on: addDays(195),
    notes: null,
    created_at: "",
  },
  {
    id: "c5",
    organization_id: ORG,
    employee_id: "e1",
    cert_type: "training",
    cert_name: "Hazardous goods (ADR)",
    issued_on: addDays(-1100),
    expires_on: addDays(-12),
    notes: "Renewal scheduled for next month.",
    created_at: "",
  },
];

export function employeeName(e: Employee): string {
  return `${e.first_name} ${e.last_name}`;
}

export function employeeById(id: string): Employee | undefined {
  return mockEmployees.find((e) => e.id === id);
}
