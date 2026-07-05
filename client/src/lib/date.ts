import type { SessionListItem } from '../types';

export interface SessionGroup {
  label: string;
  sessions: SessionListItem[];
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function dayLabel(date: Date, now: Date): string {
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(date, now)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';

  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
  if (diffDays < 7) return 'Previous 7 days';
  if (diffDays < 30) return 'Previous 30 days';
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

/** Groups sessions (already sorted newest-first) into Today / Yesterday / ... buckets. */
export function groupSessionsByDay(sessions: SessionListItem[]): SessionGroup[] {
  const now = new Date();
  const order: string[] = [];
  const buckets = new Map<string, SessionListItem[]>();

  for (const session of sessions) {
    const label = dayLabel(new Date(session.updatedAt), now);
    if (!buckets.has(label)) {
      buckets.set(label, []);
      order.push(label);
    }
    buckets.get(label)!.push(session);
  }

  return order.map((label) => ({ label, sessions: buckets.get(label)! }));
}

export function formatClockTime(iso?: string): string {
  const date = iso ? new Date(iso) : new Date();
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}
