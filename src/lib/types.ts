export type Status = 'todo' | 'doing' | 'done' | 'alert';

export interface Profile {
  id: string;
  slug: string;
  kind: 'pessoa' | 'gato';
  name: string;
  photo_path: string | null;
  data: Record<string, string>;
}

export interface Phase { id: string; position: number; title: string }

export interface Task {
  id: string;
  phase_id: string;
  position: number;
  title: string;
  owner: string;
  due_label: string | null;
  due_date: string | null;
  status: Status;
  notes: string | null;
}

export interface Doc {
  id: string;
  position: number;
  title: string;
  owner: string;
  steps: string[];
  stage: number;
  note: string | null;
  file_path: string | null;
  expires_on: string | null;
}

export interface ChecklistItem {
  id: string;
  list: string;
  position: number;
  title: string;
  detail: string | null;
  done: boolean;
  custom: boolean;
}

export interface EventRow {
  id: string;
  title: string;
  starts_on: string;
  owner: string;
  reminders_days: number[];
  gcal_event_id: string | null;
  gcal_synced_at: string | null;
}

export interface Source {
  id: string;
  grp: string;
  position: number;
  title: string;
  org: string;
  why: string | null;
  url: string;
  tag: 'oficial' | 'secundaria';
  status: 'sem_mudanca' | 'mudou' | 'nao_se_aplica';
  status_note: string | null;
  last_checked_at: string | null;
  last_changed_at: string | null;
}

export interface Setting { key: string; value: unknown }
