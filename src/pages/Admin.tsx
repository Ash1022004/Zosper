import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Auth } from '@/components/Auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { LogOut, Upload, Plus } from 'lucide-react';

const Admin = () => {
  const { user, loading, signOut } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    experience: '',
    salary: '',
    jobType: 'Full-time',
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    contactEmail: '',
    contactWhatsApp: ''
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Auth />;
  }

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      
      const jobs = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const job: any = { created_by: user.id };
        
        headers.forEach((header, index) => {
          const key = header.toLowerCase().replace(/ /g, '_');
          if (['requirements', 'responsibilities', 'benefits'].includes(key)) {
            job[key] = values[index] ? values[index].split(';').map(i => i.trim()) : [];
          } else {
            job[key] = values[index] || '';
          }
        });
        
        return job;
      });

      for (const job of jobs) {
        // Map CSV keys to database columns
        const jobData = {
          title: job.title,
          company: job.company,
          location: job.location,
          experience: job.experience,
          salary: job.salary || null,
          job_type: job.job_type || job.jobType || 'Full-time',
          description: job.description,
          requirements: job.requirements || [],
          responsibilities: job.responsibilities || [],
          benefits: job.benefits || null,
          contact_email: job.contact_email || job.contactEmail || null,
          contact_whatsapp: job.contact_whatsapp || job.contactWhatsApp || null,
          created_by: user.id
        };
        
        const { error } = await supabase.from('jobs').insert(jobData);
        if (error) throw error;
      }

      toast.success(`Successfully uploaded ${jobs.length} jobs!`);
      e.target.value = '';
    } catch (error: any) {
      toast.error('Error uploading CSV: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const jobData = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        experience: formData.experience,
        salary: formData.salary || null,
        job_type: formData.jobType,
        description: formData.description,
        requirements: formData.requirements.split('\n').filter(r => r.trim()),
        responsibilities: formData.responsibilities.split('\n').filter(r => r.trim()),
        benefits: formData.benefits ? formData.benefits.split('\n').filter(b => b.trim()) : null,
        contact_email: formData.contactEmail || null,
        contact_whatsapp: formData.contactWhatsApp || null,
        created_by: user.id
      };

      const { error } = await supabase.from('jobs').insert(jobData);

      if (error) throw error;

      toast.success('Job posted successfully!');
      setFormData({
        title: '',
        company: '',
        location: '',
        experience: '',
        salary: '',
        jobType: 'Full-time',
        description: '',
        requirements: '',
        responsibilities: '',
        benefits: '',
        contactEmail: '',
        contactWhatsApp: ''
      });
    } catch (error: any) {
      toast.error('Error posting job: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <Button onClick={signOut} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* CSV Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Bulk Upload Jobs (CSV)
            </CardTitle>
            <CardDescription>
              Upload a CSV file with job listings. Format: title, company, location, experience, salary, job_type, description, requirements (semicolon-separated), responsibilities (semicolon-separated), benefits (semicolon-separated), contact_email, contact_whatsapp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              disabled={uploading}
            />
            {uploading && <p className="mt-2 text-sm text-muted-foreground">Uploading...</p>}
          </CardContent>
        </Card>

        {/* Manual Job Entry Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Job Manually
            </CardTitle>
            <CardDescription>Create a single job listing</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Job Title *"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <Input
                  placeholder="Company Name *"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
                <Input
                  placeholder="Location *"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
                <Input
                  placeholder="Experience (e.g., 2-4 years) *"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  required
                />
                <Input
                  placeholder="Salary (optional)"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                />
                <Select value={formData.jobType} onValueChange={(value) => setFormData({ ...formData, jobType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Contact Email"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                />
                <Input
                  placeholder="WhatsApp Number"
                  value={formData.contactWhatsApp}
                  onChange={(e) => setFormData({ ...formData, contactWhatsApp: e.target.value })}
                />
              </div>
              
              <Textarea
                placeholder="Job Description *"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
              />
              
              <Textarea
                placeholder="Requirements (one per line) *"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                required
                rows={4}
              />
              
              <Textarea
                placeholder="Responsibilities (one per line) *"
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                required
                rows={4}
              />
              
              <Textarea
                placeholder="Benefits (one per line, optional)"
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                rows={3}
              />

              <Button type="submit" className="w-full">
                Post Job
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
