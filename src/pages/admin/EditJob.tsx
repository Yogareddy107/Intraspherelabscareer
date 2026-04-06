import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

export default function EditJob() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    job_type: '',
    location: '',
    experience_required: '',
    skills_required: '',
    description: '',
    salary: '',
    last_date_to_apply: '',
  });

  const { data: job, isLoading } = useQuery({
    queryKey: ['admin-job', id],
    queryFn: async () => {
      if (!id) throw new Error('Job ID required');
      
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

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        department: job.department,
        job_type: job.job_type,
        location: job.location,
        experience_required: job.experience_required,
        skills_required: job.skills_required,
        description: job.description,
        salary: job.salary || '',
        last_date_to_apply: job.last_date_to_apply || '',
      });
    }
  }, [job]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('Job ID required');

      const { error } = await supabase
        .from('jobs')
        .update({
          title: formData.title,
          department: formData.department,
          job_type: formData.job_type as 'Full-time' | 'Internship' | 'Part-time' | 'Contract',
          location: formData.location as 'Remote' | 'Onsite' | 'Hybrid',
          experience_required: formData.experience_required,
          skills_required: formData.skills_required,
          description: formData.description,
          salary: formData.salary || null,
          last_date_to_apply: formData.last_date_to_apply || null,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-all-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-job', id] });
      toast.success('Job updated successfully!');
      navigate('/admin/jobs');
    },
    onError: (error) => {
      console.error('Error updating job:', error);
      toast.error('Failed to update job. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.department || !formData.job_type || 
        !formData.location || !formData.experience_required || 
        !formData.skills_required || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    updateMutation.mutate();
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-3xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Job not found</p>
        <Button asChild>
          <Link to="/admin/jobs">Back to Jobs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to="/admin/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Edit Job</h1>
        <p className="text-muted-foreground mt-1">
          Update the job posting details.
        </p>
      </div>

      {/* Form */}
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Modify the information below to update the job posting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Senior Software Engineer"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                  className="form-input-focus"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  placeholder="e.g., Engineering"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  required
                  className="form-input-focus"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="job_type">Job Type *</Label>
                <Select
                  value={formData.job_type}
                  onValueChange={(value) => handleChange('job_type', value)}
                >
                  <SelectTrigger className="form-input-focus">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => handleChange('location', value)}
                >
                  <SelectTrigger className="form-input-focus">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Onsite">Onsite</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience *</Label>
                <Select
                  value={formData.experience_required}
                  onValueChange={(value) => handleChange('experience_required', value)}
                >
                  <SelectTrigger className="form-input-focus">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fresher">Fresher</SelectItem>
                    <SelectItem value="1-3 years">1-3 years</SelectItem>
                    <SelectItem value="3-5 years">3-5 years</SelectItem>
                    <SelectItem value="5+ years">5+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Required Skills *</Label>
              <Input
                id="skills"
                placeholder="e.g., React, TypeScript, Node.js, PostgreSQL"
                value={formData.skills_required}
                onChange={(e) => handleChange('skills_required', e.target.value)}
                required
                className="form-input-focus"
              />
              <p className="text-xs text-muted-foreground">
                Separate skills with commas
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                required
                className="form-input-focus min-h-[200px]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range (Optional)</Label>
                <Input
                  id="salary"
                  placeholder="e.g., $80,000 - $120,000"
                  value={formData.salary}
                  onChange={(e) => handleChange('salary', e.target.value)}
                  className="form-input-focus"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_date">Last Date to Apply (Optional)</Label>
                <Input
                  id="last_date"
                  type="date"
                  value={formData.last_date_to_apply}
                  onChange={(e) => handleChange('last_date_to_apply', e.target.value)}
                  className="form-input-focus"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to="/admin/jobs">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
