import { Job } from '@/types/job';
import { JobsSettings, upsertJobs, saveJobs, loadJobs } from '@/store/jobsStore';

function parseCsvToJobs(csv: string): Job[] {
  const lines = csv.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const header = lines[0].split(',').map(h => h.trim());
  const idx = (name: string) => header.findIndex(h => h.toLowerCase() === name.toLowerCase());
  const get = (arr: string[], name: string) => {
    const i = idx(name);
    return i >= 0 ? arr[i]?.trim() ?? '' : '';
  };
  const jobs: Job[] = [];
  for (let li = 1; li < lines.length; li++) {
    const parts = lines[li].split(',');
    const id = get(parts, 'id') || `${Date.now()}-${li}`;
    const title = get(parts, 'title');
    const company = get(parts, 'company');
    const location = get(parts, 'location');
    const experience = get(parts, 'experience');
    const dateStr = get(parts, 'datePosted');
    const jobType = get(parts, 'jobType') as Job['jobType'];
    const description = get(parts, 'description');
    if (!title || !company || !location || !experience || !dateStr || !jobType || !description) continue;
    const salary = get(parts, 'salary');
    const benefits = get(parts, 'benefits') ? get(parts, 'benefits').split('|').map(s => s.trim()).filter(Boolean) : undefined;
    const requirements = get(parts, 'requirements') ? get(parts, 'requirements').split('|').map(s => s.trim()).filter(Boolean) : [];
    const responsibilities = get(parts, 'responsibilities') ? get(parts, 'responsibilities').split('|').map(s => s.trim()).filter(Boolean) : [];
    const contactEmail = get(parts, 'contactEmail') || undefined;
    const contactWhatsApp = get(parts, 'contactWhatsApp') || undefined;
    const companyLogo = get(parts, 'companyLogo') || undefined;
    const datePosted = new Date(dateStr);
    if (isNaN(datePosted.getTime())) continue;
    jobs.push({ id, title, company, location, experience, salary: salary || undefined, datePosted, jobType, description, requirements, responsibilities, benefits, contactEmail, contactWhatsApp, companyLogo });
  }
  return jobs;
}

export async function refreshFromCsvSource(settings: JobsSettings): Promise<number> {
  if (!settings.csvSourceUrl) return 0;
  try {
    const res = await fetch(settings.csvSourceUrl, { cache: 'no-store' });
    if (!res.ok) return 0;
    const text = await res.text();
    const incoming = parseCsvToJobs(text);
    if (!incoming.length) return 0;
    const merged = upsertJobs(loadJobs(), incoming);
    saveJobs(merged);
    return incoming.length;
  } catch {
    return 0;
  }
}


