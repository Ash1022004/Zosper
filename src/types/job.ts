export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  salary?: string;
  datePosted: Date;
  jobType: 'Full-time' | 'Internship' | 'Contract' | 'Part-time';
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits?: string[];
  contactEmail?: string;
  contactWhatsApp?: string;
  companyLogo?: string;
}

export interface JobFilters {
  location: string;
  jobType: string;
  experienceLevel: string;
  datePosted: string;
  searchQuery: string;
}
