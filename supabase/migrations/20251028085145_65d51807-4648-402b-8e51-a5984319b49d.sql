-- Create jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  experience TEXT NOT NULL,
  salary TEXT,
  date_posted TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  job_type TEXT NOT NULL CHECK (job_type IN ('Full-time', 'Internship', 'Contract', 'Part-time')),
  description TEXT NOT NULL,
  requirements TEXT[] NOT NULL DEFAULT '{}',
  responsibilities TEXT[] NOT NULL DEFAULT '{}',
  benefits TEXT[],
  contact_email TEXT,
  contact_whatsapp TEXT,
  company_logo TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Public can view all jobs
CREATE POLICY "Anyone can view jobs"
ON public.jobs
FOR SELECT
USING (true);

-- Authenticated users can create jobs
CREATE POLICY "Authenticated users can create jobs"
ON public.jobs
FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- Users can update their own jobs
CREATE POLICY "Users can update their own jobs"
ON public.jobs
FOR UPDATE
USING (auth.uid() = created_by);

-- Users can delete their own jobs
CREATE POLICY "Users can delete their own jobs"
ON public.jobs
FOR DELETE
USING (auth.uid() = created_by);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_jobs_updated_at();

-- Create index for faster queries
CREATE INDEX idx_jobs_date_posted ON public.jobs(date_posted DESC);
CREATE INDEX idx_jobs_job_type ON public.jobs(job_type);
CREATE INDEX idx_jobs_location ON public.jobs(location);