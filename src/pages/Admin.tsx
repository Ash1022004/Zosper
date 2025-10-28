import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Briefcase, LogOut, Upload, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    location: '',
    experience: '',
    salary: '',
    jobType: 'Full-time' as 'Full-time' | 'Internship' | 'Contract' | 'Part-time',
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    contactEmail: '',
    contactWhatsApp: '',
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
    } else {
      setUser(user);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('jobs').insert({
        title: jobForm.title,
        company: jobForm.company,
        location: jobForm.location,
        experience: jobForm.experience,
        salary: jobForm.salary || null,
        job_type: jobForm.jobType,
        description: jobForm.description,
        requirements: jobForm.requirements.split('\n').filter(r => r.trim()),
        responsibilities: jobForm.responsibilities.split('\n').filter(r => r.trim()),
        benefits: jobForm.benefits ? jobForm.benefits.split('\n').filter(b => b.trim()) : null,
        contact_email: jobForm.contactEmail || null,
        contact_whatsapp: jobForm.contactWhatsApp || null,
        created_by: user.id,
      });

      if (error) throw error;

      toast.success('Job posted successfully!');
      setJobForm({
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
        contactWhatsApp: '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const text = await file.text();
      const rows = text.split('\n').slice(1);
      
      const jobs = rows
        .filter(row => row.trim())
        .map(row => {
          const cols = row.split(',').map(col => col.trim().replace(/^"|"$/g, ''));
          return {
            title: cols[0],
            company: cols[1],
            location: cols[2],
            experience: cols[3],
            salary: cols[4] || null,
            job_type: cols[5] as 'Full-time' | 'Internship' | 'Contract' | 'Part-time',
            description: cols[6],
            requirements: cols[7] ? cols[7].split('|') : [],
            responsibilities: cols[8] ? cols[8].split('|') : [],
            benefits: cols[9] ? cols[9].split('|') : null,
            contact_email: cols[10] || null,
            contact_whatsapp: cols[11] || null,
            created_by: user.id,
          };
        });

      const { error } = await supabase.from('jobs').insert(jobs);
      if (error) throw error;

      toast.success(`${jobs.length} jobs uploaded successfully!`);
      e.target.value = '';
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload CSV');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="add" className="space-y-6">
          <TabsList>
            <TabsTrigger value="add">
              <Plus className="w-4 h-4 mr-2" />
              Add Job
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="w-4 h-4 mr-2" />
              CSV Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Post New Job</CardTitle>
                <CardDescription>Add a new job posting to the board</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title *</Label>
                      <Input
                        id="title"
                        value={jobForm.title}
                        onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company *</Label>
                      <Input
                        id="company"
                        value={jobForm.company}
                        onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={jobForm.location}
                        onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience *</Label>
                      <Input
                        id="experience"
                        placeholder="e.g., 3-5 years"
                        value={jobForm.experience}
                        onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary">Salary</Label>
                      <Input
                        id="salary"
                        placeholder="e.g., ₹15-25 LPA"
                        value={jobForm.salary}
                        onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobType">Job Type *</Label>
                      <Select
                        value={jobForm.jobType}
                        onValueChange={(value: any) => setJobForm({ ...jobForm, jobType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      value={jobForm.description}
                      onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements">Requirements (one per line) *</Label>
                    <Textarea
                      id="requirements"
                      rows={5}
                      placeholder="Enter each requirement on a new line"
                      value={jobForm.requirements}
                      onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="responsibilities">Responsibilities (one per line) *</Label>
                    <Textarea
                      id="responsibilities"
                      rows={5}
                      placeholder="Enter each responsibility on a new line"
                      value={jobForm.responsibilities}
                      onChange={(e) => setJobForm({ ...jobForm, responsibilities: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="benefits">Benefits (one per line)</Label>
                    <Textarea
                      id="benefits"
                      rows={3}
                      placeholder="Enter each benefit on a new line"
                      value={jobForm.benefits}
                      onChange={(e) => setJobForm({ ...jobForm, benefits: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={jobForm.contactEmail}
                        onChange={(e) => setJobForm({ ...jobForm, contactEmail: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactWhatsApp">Contact WhatsApp</Label>
                      <Input
                        id="contactWhatsApp"
                        placeholder="+91-XXXXXXXXXX"
                        value={jobForm.contactWhatsApp}
                        onChange={(e) => setJobForm({ ...jobForm, contactWhatsApp: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Posting...' : 'Post Job'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload Jobs via CSV</CardTitle>
                <CardDescription>
                  Upload multiple jobs at once using a CSV file
                  <br />
                  <span className="text-xs">
                    Format: title, company, location, experience, salary, jobType, description, requirements (pipe-separated), responsibilities (pipe-separated), benefits (pipe-separated), contactEmail, contactWhatsApp
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <Label htmlFor="csv-upload" className="cursor-pointer">
                      <span className="text-primary hover:underline">Choose CSV file</span> or drag and drop
                    </Label>
                    <Input
                      id="csv-upload"
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleCSVUpload}
                      disabled={loading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
