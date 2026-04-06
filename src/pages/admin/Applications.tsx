import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Application, Job } from '@/types/database';
import ApplicationStatusBadge from '@/components/admin/ApplicationStatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';

export default function Applications() {
  const [search, setSearch] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: applications, isLoading } = useQuery({
    queryKey: ['admin-all-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('*, job:jobs(*)')
        .order('applied_date', { ascending: false });
      
      if (error) throw error;
      return data as (Application & { job: Job })[];
    },
  });

  const jobs = useMemo(() => {
    if (!applications) return [];
    const uniqueJobs = new Map<string, string>();
    applications.forEach((app) => {
      if (app.job) {
        uniqueJobs.set(app.job.id, app.job.title);
      }
    });
    return Array.from(uniqueJobs.entries()).map(([id, title]) => ({ id, title }));
  }, [applications]);

  const filteredApplications = useMemo(() => {
    if (!applications) return [];

    return applications.filter((app) => {
      const matchesSearch = !search || 
        app.candidate_name.toLowerCase().includes(search.toLowerCase()) ||
        app.email.toLowerCase().includes(search.toLowerCase());
      
      const matchesJob = !jobFilter || jobFilter === 'all' || app.job_id === jobFilter;
      const matchesStatus = !statusFilter || statusFilter === 'all' || app.status === statusFilter;

      return matchesSearch && matchesJob && matchesStatus;
    });
  }, [applications, search, jobFilter, statusFilter]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Applications</h1>
        <p className="text-muted-foreground mt-1">
          Review and manage all candidate applications.
        </p>
      </div>

      {/* Filters */}
      <Card className="border border-border/50">
        <CardContent className="p-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 form-input-focus"
              />
            </div>
            <Select value={jobFilter} onValueChange={setJobFilter}>
              <SelectTrigger className="form-input-focus">
                <SelectValue placeholder="All Jobs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="form-input-focus">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Applied">Applied</SelectItem>
                <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Hired">Hired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle>
            {isLoading ? 'Loading...' : `${filteredApplications.length} Application${filteredApplications.length !== 1 ? 's' : ''}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : filteredApplications.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Job Applied</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">
                          {application.candidate_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {application.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{application.phone}</TableCell>
                    <TableCell>{application.experience}</TableCell>
                    <TableCell>{application.job?.title || 'N/A'}</TableCell>
                    <TableCell>
                      {format(new Date(application.applied_date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <ApplicationStatusBadge status={application.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/admin/applications/${application.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No applications found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
