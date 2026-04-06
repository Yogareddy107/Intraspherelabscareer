export interface Job {
  id: string;
  title: string;
  department: string;
  job_type: 'Full-time' | 'Internship' | 'Part-time' | 'Contract';
  location: 'Remote' | 'Onsite' | 'Hybrid';
  experience_required: string;
  skills_required: string;
  description: string;
  salary?: string;
  status: 'Open' | 'Closed';
  last_date_to_apply?: string;
  posted_date: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  candidate_name: string;
  email: string;
  phone: string;
  location?: string;
  experience: string;
  skills?: string;
  resume_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  status: 'Applied' | 'Shortlisted' | 'Rejected' | 'Hired';
  admin_notes?: string;
  applied_date: string;
  created_at: string;
  updated_at: string;
  job?: Job;
}

export interface AdminSettings {
  id: string;
  setting_key: string;
  setting_value: string;
  created_at: string;
  updated_at: string;
}

export type ExperienceLevel = 'Fresher' | '1-3 years' | '3-5 years' | '5+ years';
export type JobType = 'Full-time' | 'Internship' | 'Part-time' | 'Contract';
export type LocationType = 'Remote' | 'Onsite' | 'Hybrid';
export type ApplicationStatus = 'Applied' | 'Shortlisted' | 'Rejected' | 'Hired';
