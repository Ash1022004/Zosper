import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Job } from '@/types/job';
import { getSettings, JobsSettings, loadJobs, saveJobs, saveSettings, upsertJobs } from '@/store/jobsStore';
import { getCurrentUser, logout } from '@/store/authStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { refreshFromCsvSource } from '@/lib/sources';

function parseCsv(text: string): Job[] {
  // Minimal CSV parser for simple admin use: expects header names matching Job keys
  // Required: id,title,company,location,experience,datePosted,jobType,description
  // Optional: salary,benefits (| separated),requirements (|),responsibilities (|),contactEmail,contactWhatsApp,companyLogo
  const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
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

const Admin = () => {
  const { toast } = useToast();
  const [csvText, setCsvText] = useState('');
  const [csvFileName, setCsvFileName] = useState('');
  const [settings, setSettings] = useState<JobsSettings>(() => getSettings());
  const existingJobs = useMemo(() => loadJobs(), []);

  const [manual, setManual] = useState({
    title: '',
    company: '',
    location: '',
    experience: '',
    salary: '',
    jobType: 'Full-time' as Job['jobType'],
    description: '',
    contactEmail: '',
    contactWhatsApp: ''
  });

  const handleCsvImport = () => {
    const parsed = parseCsv(csvText);
    if (!parsed.length) {
      toast({ title: 'CSV Import', description: 'No valid rows found', variant: 'destructive' });
      return;
    }
    const merged = upsertJobs(existingJobs, parsed);
    saveJobs(merged);
    toast({ title: 'Jobs updated', description: `${parsed.length} rows processed.` });
  };

  const handleSettingsSave = () => {
    saveSettings(settings);
    toast({ title: 'Settings saved' });
  };

  const handleCsvFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      setCsvText(text);
      setCsvFileName(file.name);
    };
    reader.readAsText(file);
  };

  const handleManualAdd = () => {
    if (!manual.title || !manual.company || !manual.location || !manual.experience || !manual.description) {
      toast({ title: 'Missing fields', description: 'Please fill required fields', variant: 'destructive' });
      return;
    }
    const newJob: Job = {
      id: `${Date.now()}`,
      title: manual.title,
      company: manual.company,
      location: manual.location,
      experience: manual.experience,
      salary: manual.salary || undefined,
      datePosted: new Date(),
      jobType: manual.jobType,
      description: manual.description,
      requirements: [],
      responsibilities: [],
      contactEmail: manual.contactEmail || undefined,
      contactWhatsApp: manual.contactWhatsApp || undefined
    };
    const merged = upsertJobs(loadJobs(), [newJob]);
    saveJobs(merged);
    toast({ title: 'Job added' });
    setManual({
      title: '', company: '', location: '', experience: '', salary: '', jobType: 'Full-time', description: '', contactEmail: '', contactWhatsApp: ''
    });
  };

  const handleRefreshNow = async () => {
    const count = await refreshFromCsvSource(getSettings());
    toast({ title: 'Refreshed from source', description: `${count} records processed` });
  };

  const user = getCurrentUser();

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Signed in as {user?.email}</div>
        <Button variant="outline" onClick={() => { logout(); window.location.href = '/login'; }}>Logout</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
          <CardDescription>Upload a CSV file with job listings. Expected columns:</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc list-inside text-sm text-muted-foreground">
            <li>Title, Company, Location, Experience, Salary (optional), Date Posted</li>
            <li>Description, Job Type (Full-time/Internship/Contract)</li>
            <li>Email (optional), WhatsApp (optional)</li>
          </ul>
          <div className="space-y-2">
            <Input type="file" accept=".csv" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCsvFile(f); }} />
            {csvFileName ? <div className="text-xs text-muted-foreground">Loaded: {csvFileName}</div> : null}
          </div>
          <Label htmlFor="csv">Or paste CSV</Label>
          <Textarea id="csv" value={csvText} onChange={(e) => setCsvText(e.target.value)} rows={8} placeholder="id,title,company,location,experience,datePosted,jobType,description,requirements,benefits,salary,contactEmail,contactWhatsApp,companyLogo\n1,Senior Frontend,TechCorp,Bangalore,3-5 years,2025-10-26,Full-time,Description,React|TS,Health Insurance,₹15-25 LPA,hr@x.com,+91-..." />
          <div className="flex gap-2">
            <Button onClick={handleCsvImport}>Import CSV</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>External Source</CardTitle>
          <CardDescription>Configure a published Google Sheet CSV link or Airtable CSV view.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="csvUrl">CSV Source URL</Label>
            <Input id="csvUrl" value={settings.csvSourceUrl || ''} onChange={(e) => setSettings(s => ({ ...s, csvSourceUrl: e.target.value }))} placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="refresh">Auto-refresh interval (ms)</Label>
            <Input id="refresh" type="number" value={settings.autoRefreshMs ?? ''} onChange={(e) => setSettings(s => ({ ...s, autoRefreshMs: e.target.value ? Number(e.target.value) : undefined }))} placeholder="e.g., 3600000 for 1 hour" />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSettingsSave}>Save Settings</Button>
            <Button variant="outline" onClick={handleRefreshNow}>Refresh now</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Job Manually</CardTitle>
          <CardDescription>Use this form to add a single job posting.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Job Title *</Label>
              <Input value={manual.title} onChange={(e) => setManual(s => ({ ...s, title: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Company *</Label>
              <Input value={manual.company} onChange={(e) => setManual(s => ({ ...s, company: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Location *</Label>
              <Input value={manual.location} onChange={(e) => setManual(s => ({ ...s, location: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Experience *</Label>
              <Input placeholder="e.g., 2+ years" value={manual.experience} onChange={(e) => setManual(s => ({ ...s, experience: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Salary</Label>
              <Input placeholder="e.g., ₹10-15 LPA" value={manual.salary} onChange={(e) => setManual(s => ({ ...s, salary: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Job Type</Label>
              <Select value={manual.jobType} onValueChange={(v) => setManual(s => ({ ...s, jobType: v as Job['jobType'] }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-4 space-y-2">
              <Label>Description *</Label>
              <Textarea rows={5} value={manual.description} onChange={(e) => setManual(s => ({ ...s, description: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={manual.contactEmail} onChange={(e) => setManual(s => ({ ...s, contactEmail: e.target.value }))} placeholder="hr@company.com" />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input value={manual.contactWhatsApp} onChange={(e) => setManual(s => ({ ...s, contactWhatsApp: e.target.value }))} placeholder="+1234567890" />
            </div>
          </div>
          <div className="pt-2">
            <Button className="w-full" onClick={handleManualAdd}>Add Job</Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">Current jobs in store: {existingJobs.length}</div>
    </div>
  );
};

export default Admin;


