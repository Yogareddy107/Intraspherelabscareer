-- Create jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('Full-time', 'Internship', 'Part-time', 'Contract')),
  location TEXT NOT NULL CHECK (location IN ('Remote', 'Onsite', 'Hybrid')),
  experience_required TEXT NOT NULL,
  skills_required TEXT NOT NULL,
  description TEXT NOT NULL,
  salary TEXT,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Closed')),
  last_date_to_apply DATE,
  posted_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  candidate_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT,
  experience TEXT NOT NULL,
  skills TEXT,
  resume_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  status TEXT NOT NULL DEFAULT 'Applied' CHECK (status IN ('Applied', 'Shortlisted', 'Rejected', 'Hired')),
  admin_notes TEXT,
  applied_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_settings table for PIN storage
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default admin PIN
INSERT INTO public.admin_settings (setting_key, setting_value) VALUES ('admin_pin', '199188');

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Jobs policies (public read for open jobs, no auth needed for viewing)
CREATE POLICY "Anyone can view open jobs" 
ON public.jobs 
FOR SELECT 
USING (status = 'Open');

CREATE POLICY "Anyone can view all jobs for admin" 
ON public.jobs 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert jobs" 
ON public.jobs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update jobs" 
ON public.jobs 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete jobs" 
ON public.jobs 
FOR DELETE 
USING (true);

-- Applications policies (candidates can submit, admin can view all)
CREATE POLICY "Anyone can submit applications" 
ON public.applications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view applications" 
ON public.applications 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update applications" 
ON public.applications 
FOR UPDATE 
USING (true);

-- Admin settings policies (read for PIN verification)
CREATE POLICY "Anyone can read admin settings" 
ON public.admin_settings 
FOR SELECT 
USING (true);

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true);

-- Storage policies for resume uploads
CREATE POLICY "Anyone can upload resumes" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Anyone can view resumes" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'resumes');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();