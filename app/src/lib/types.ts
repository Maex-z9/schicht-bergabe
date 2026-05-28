/*
  Domain-Types — spiegeln die Postgres-Tabellen aus
  supabase/migrations/0001_initial.sql. Sobald Supabase verdrahtet ist,
  generieren wir diese aus dem Schema (`supabase gen types typescript`)
  und ersetzen diese Datei.
*/

export type Role = "admin" | "member";

export interface Organization {
  id: string;
  name: string;
  created_at: string;
}

export interface Profile {
  id: string; // == auth.users.id
  organization_id: string;
  email: string;
  role: Role;
  created_at: string;
}

export interface Employee {
  id: string;
  organization_id: string;
  first_name: string;
  last_name: string;
  employee_number: string | null;
  email: string | null;
  department: string | null;
  active: boolean;
  created_at: string;
}

export type CertStatus = "ok" | "soon" | "crit" | "expired";

export interface Certificate {
  id: string;
  organization_id: string;
  employee_id: string;
  cert_type: string;
  cert_name: string;
  issued_on: string | null; // ISO date
  expires_on: string;       // ISO date
  notes: string | null;
  created_at: string;
}

export interface ReminderLog {
  id: string;
  certificate_id: string;
  reminder_days: 90 | 60 | 30 | 14 | 7;
  sent_at: string;
  recipient_email: string;
  status: "sent" | "failed";
}

/* ---------- Helpers ---------- */

export function daysUntil(isoDate: string, now: Date = new Date()): number {
  const target = new Date(isoDate + "T00:00:00Z").getTime();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.round((target - today) / 86400000);
}

export function statusFor(expiresOn: string, now: Date = new Date()): CertStatus {
  const d = daysUntil(expiresOn, now);
  if (d < 0) return "expired";
  if (d <= 14) return "crit";
  if (d <= 30) return "soon";
  return "ok";
}

export function statusLabel(s: CertStatus): string {
  return {
    ok: "Valid",
    soon: "Expires soon",
    crit: "Critical",
    expired: "Expired",
  }[s];
}

/** Erinnerungs-Stufen, die ein Hintergrund-Job am Tag X vor Ablauf triggert. */
export const REMINDER_DAYS = [90, 60, 30, 14, 7] as const;
