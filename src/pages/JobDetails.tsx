import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, Clock, Calendar, DollarSign, Share2, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format, formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const [copied, setCopied] = useState(false);

  const { data: job, isLoading, error } = useQuery({
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

  const handleShareLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-12 bg-muted rounded w-3/4" />
            <div className="h-6 bg-muted rounded w-1/2" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Job Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild className="rounded-full">
            <Link to="/jobs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const skills = job.skills_required.split(',').map((s) => s.trim());

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <div className="flex items-center justify-between mb-8">
          <Button asChild variant="ghost" size="sm" className="-ml-3">
            <Link to="/jobs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShareLink}
            className="rounded-full gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                Share Job
              </>
            )}
          </Button>
        </div>

        {/* Job Header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">
                {job.title}
              </h1>
              <p className="text-lg text-muted-foreground font-sans">{job.department}</p>
            </div>
            <Badge variant="outline" className="text-sm px-4 py-1 rounded-full font-sans">
              {job.job_type}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>{job.experience_required}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Posted {formatDistanceToNow(new Date(job.posted_date), { addSuffix: true })}</span>
            </div>
            {job.last_date_to_apply && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Apply by {format(new Date(job.last_date_to_apply), 'MMM d, yyyy')}</span>
              </div>
            )}
            {job.salary && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>{job.salary}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border border-border">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Job Description
                </h2>
                <div className="prose prose-sm max-w-none text-muted-foreground font-sans">
                  {job.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="rounded-full font-sans">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border border-border sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 font-sans">
                    Interested in this role?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Submit your application and we'll get back to you soon.
                  </p>
                </div>

                <Button asChild className="w-full rounded-full" size="lg">
                  <Link to={`/jobs/${job.id}/apply`}>
                    Apply Now
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="w-full rounded-full"
                  size="lg"
                  onClick={handleShareLink}
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Link Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share This Job
                    </>
                  )}
                </Button>

                <Separator />

                <div className="space-y-3 text-sm font-sans">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Department</span>
                    <span className="font-medium text-foreground">{job.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Job Type</span>
                    <span className="font-medium text-foreground">{job.job_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium text-foreground">{job.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Experience</span>
                    <span className="font-medium text-foreground">{job.experience_required}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
