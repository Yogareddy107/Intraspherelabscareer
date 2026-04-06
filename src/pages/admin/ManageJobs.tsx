import { Link } from 'react-router-dom';
import { PlusCircle, Pencil, Eye, XCircle, CheckCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ManageJobs() {
  const queryClient = useQueryClient();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['admin-all-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('posted_date', { ascending: false });
      
      if (error) throw error;
      return data as Job[];
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'Open' | 'Closed' }) => {
      const { error } = await supabase
        .from('jobs')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-all-jobs'] });
      toast.success('Job status updated');
    },
    onError: () => {
      toast.error('Failed to update job status');
    },
  });

  const handleToggleStatus = (job: Job) => {
    const newStatus = job.status === 'Open' ? 'Closed' : 'Open';
    toggleStatusMutation.mutate({ id: job.id, status: newStatus });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Jobs</h1>
          <p className="text-muted-foreground mt-1">
            View, edit, and manage all job postings.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/jobs/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Post New Job
          </Link>
        </Button>
      </div>

      {/* Jobs Table */}
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle>All Jobs ({jobs?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : jobs && jobs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Posted Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{job.title}</p>
                        <p className="text-sm text-muted-foreground">{job.job_type}</p>
                      </div>
                    </TableCell>
                    <TableCell>{job.department}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          job.status === 'Open'
                            ? 'badge-success'
                            : 'badge-danger'
                        }
                      >
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(job.posted_date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/jobs/${job.id}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/admin/jobs/${job.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              {job.status === 'Open' ? (
                                <XCircle className="h-4 w-4 text-destructive" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {job.status === 'Open' ? 'Close this job?' : 'Reopen this job?'}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {job.status === 'Open'
                                  ? 'This will hide the job from the public careers page and stop accepting new applications.'
                                  : 'This will make the job visible on the public careers page and start accepting applications again.'}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleToggleStatus(job)}>
                                {job.status === 'Open' ? 'Close Job' : 'Reopen Job'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No jobs posted yet</p>
              <Button asChild>
                <Link to="/admin/jobs/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Post Your First Job
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
