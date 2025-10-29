import { mockJobs } from '@/data/mockJobs';
import { Job } from '@/types/job';

const STORAGE_KEY = 'djp.jobs.v1';
const SETTINGS_KEY = 'djp.settings.v1';

export interface JobsSettings {
  csvSourceUrl?: string;
  autoRefreshMs?: number; // 0 or undefined disables
}

function reviveJob(raw: any): Job | null {
  if (!raw) return null;
  try {
    return {
      ...raw,
      datePosted: new Date(raw.datePosted),
    } as Job;
  } catch {
    return null;
  }
}

export function loadJobs(): Job[] {
  try {
    const str = localStorage.getItem(STORAGE_KEY);
    if (!str) return mockJobs;
    const arr = JSON.parse(str);
    if (!Array.isArray(arr)) return mockJobs;
    const revived = arr.map(reviveJob).filter(Boolean) as Job[];
    return revived.length ? revived : mockJobs;
  } catch {
    return mockJobs;
  }
}

export function saveJobs(jobs: Job[]): void {
  const serializable = jobs.map(j => ({ ...j, datePosted: j.datePosted.toISOString() }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
}

export function getSettings(): JobsSettings {
  try {
    const str = localStorage.getItem(SETTINGS_KEY);
    if (!str) return {};
    return JSON.parse(str) as JobsSettings;
  } catch {
    return {};
  }
}

export function saveSettings(next: JobsSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
}

export function upsertJobs(existing: Job[], incoming: Job[]): Job[] {
  const byId = new Map<string, Job>();
  existing.forEach(j => byId.set(j.id, j));
  incoming.forEach(j => byId.set(j.id, j));
  const merged = Array.from(byId.values());
  merged.sort((a, b) => b.datePosted.getTime() - a.datePosted.getTime());
  return merged;
}


