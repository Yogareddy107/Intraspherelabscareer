import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Mail, Phone, MapPin, Briefcase, ExternalLink, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Application, Job, ApplicationStatus } from '@/types/database';
import ApplicationStatusBadge from '@/components/admin/ApplicationStatusBadge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [status, setStatus] = useState<ApplicationStatus>('Applied');
  const [notes, setNotes] = useState('');

  const { data: application, isLoading } = useQuery({
    queryKey: ['admin-application', id],
    queryFn: async () => {
      if (!id) throw new Error('Application ID required');
      
      const { data, error } = await supabase
        .from('applications')
        .select('*, job:jobs(*)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Application & { job: Job };
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (application) {
      setStatus(application.status);
      setNotes(application.admin_notes || '');
    }
  }, [application]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('Application ID required');

      const { error } = await supabase
        .from('applications')
        .update({
          status,
          admin_notes: notes,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-application', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-all-applications'] });
      toast.success('Application updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update application');
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Application not found</p>
        <Button asChild>
          <Link to="/admin/applications">Back to Applications</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to="/admin/applications">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Applications
          </Link>
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {application.candidate_name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Applied for {application.job?.title || 'Unknown Position'}
            </p>
          </div>
          <ApplicationStatusBadge status={application.status} />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a 
                      href={`mailto:${application.email}`}
                      className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {application.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <a 
                      href={`tel:${application.phone}`}
                      className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {application.phone}
                    </a>
                  </div>
                </div>
                {application.location && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium text-foreground">{application.location}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <p className="font-medium text-foreground">{application.experience}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          {application.skills && (
            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{application.skills}</p>
              </CardContent>
            </Card>
          )}

          {/* Links */}
          {(application.resume_url || application.linkedin_url || application.portfolio_url) && (
            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle>Documents & Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {application.resume_url && (
                  <Button asChild variant="outline" className="w-full justify-start">
                    <a href={application.resume_url} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Download Resume
                      <ExternalLink className="ml-auto h-4 w-4" />
                    </a>
                  </Button>
                )}
                {application.linkedin_url && (
                  <Button asChild variant="outline" className="w-full justify-start">
                    <a href={application.linkedin_url} target="_blank" rel="noopener noreferrer">
                      LinkedIn Profile
                      <ExternalLink className="ml-auto h-4 w-4" />
                    </a>
                  </Button>
                )}
                {application.portfolio_url && (
                  <Button asChild variant="outline" className="w-full justify-start">
                    <a href={application.portfolio_url} target="_blank" rel="noopener noreferrer">
                      Portfolio
                      <ExternalLink className="ml-auto h-4 w-4" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Admin Controls */}
        <div className="space-y-6">
          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Applied Date</p>
                <p className="font-medium text-foreground">
                  {format(new Date(application.applied_date), 'MMMM d, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Position</p>
                <p className="font-medium text-foreground">
                  {application.job?.title || 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium text-foreground">
                  {application.job?.department || 'Unknown'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle>Update Application</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as ApplicationStatus)}>
                  <SelectTrigger className="form-input-focus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Hired">Hired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="notes">Internal Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes about this candidate..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="form-input-focus min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground">
                  These notes are only visible to HR team
                </p>
              </div>

              <Button 
                onClick={() => updateMutation.mutate()} 
                className="w-full"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
