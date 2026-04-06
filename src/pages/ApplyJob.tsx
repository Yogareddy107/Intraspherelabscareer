import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, CheckCircle, Loader2 } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export default function ApplyJob() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    candidate_name: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    skills: '',
    linkedin_url: '',
    portfolio_url: '',
  });

  const { data: job, isLoading: jobLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      if (!id) throw new Error('Job ID is required');
      
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Job;
    },
    enabled: !!id,
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!id || !job) throw new Error('Job not found');

      let resumeUrl = '';

      // Upload resume if provided
      if (resumeFile) {
        setUploading(true);
        const fileExt = resumeFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('resumes')
          .upload(fileName, resumeFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('resumes')
          .getPublicUrl(fileName);

        resumeUrl = publicUrl;
        setUploading(false);
      }

      // Submit application
      const { error } = await supabase
        .from('applications')
        .insert({
          job_id: id,
          candidate_name: formData.candidate_name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location || null,
          experience: formData.experience,
          skills: formData.skills || null,
          resume_url: resumeUrl || null,
          linkedin_url: formData.linkedin_url || null,
          portfolio_url: formData.portfolio_url || null,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (error) => {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
      setUploading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.candidate_name || !formData.email || !formData.phone || !formData.experience) {
      toast.error('Please fill in all required fields');
      return;
    }

    submitMutation.mutate();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a PDF or DOC file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setResumeFile(file);
    }
  };

  if (jobLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Job Not Found</h1>
          <Button asChild>
            <Link to="/jobs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="border border-border/50">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Application Submitted!
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Thank you for applying to the <strong>{job.title}</strong> position at Intrasphere Labs. 
                Our hiring team will review your application and get back to you soon.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link to="/jobs">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Browse More Jobs
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/">
                    Go to Homepage
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Back Button */}
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link to={`/jobs/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Job Details
          </Link>
        </Button>

        {/* Application Form */}
        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle>Apply for {job.title}</CardTitle>
            <CardDescription>
              {job.department} • {job.location} • {job.job_type}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                  Personal Information
                </h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.candidate_name}
                      onChange={(e) => handleInputChange('candidate_name', e.target.value)}
                      required
                      className="form-input-focus"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="form-input-focus"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                      className="form-input-focus"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Current Location</Label>
                    <Input
                      id="location"
                      placeholder="City, Country"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="form-input-focus"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                  Professional Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience *</Label>
                  <Select
                    value={formData.experience}
                    onValueChange={(value) => handleInputChange('experience', value)}
                  >
                    <SelectTrigger className="form-input-focus">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fresher">Fresher (0-1 year)</SelectItem>
                      <SelectItem value="1-3 years">1-3 years</SelectItem>
                      <SelectItem value="3-5 years">3-5 years</SelectItem>
                      <SelectItem value="5+ years">5+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  <Textarea
                    id="skills"
                    placeholder="e.g., JavaScript, React, Node.js, Python..."
                    value={formData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    className="form-input-focus min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resume">Resume (PDF or DOC, max 5MB)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="form-input-focus"
                    />
                  </div>
                  {resumeFile && (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      {resumeFile.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Links */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                  Links (Optional)
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                      id="linkedin"
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={formData.linkedin_url}
                      onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                      className="form-input-focus"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio URL</Label>
                    <Input
                      id="portfolio"
                      type="url"
                      placeholder="https://..."
                      value={formData.portfolio_url}
                      onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
                      className="form-input-focus"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={submitMutation.isPending || uploading}
              >
                {(submitMutation.isPending || uploading) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {uploading ? 'Uploading Resume...' : submitMutation.isPending ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
