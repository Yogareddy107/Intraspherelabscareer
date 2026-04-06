import { Link } from 'react-router-dom';
import { Briefcase, Users, Clock, TrendingUp, ArrowRight, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Job, Application } from '@/types/database';
import StatsCard from '@/components/admin/StatsCard';
import ApplicationStatusBadge from '@/components/admin/ApplicationStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format, subDays } from 'date-fns';

export default function Dashboard() {
  const { data: jobs } = useQuery({
    queryKey: ['admin-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('posted_date', { ascending: false });
      
      if (error) throw error;
      return data as Job[];
    },
  });

  const { data: applications } = useQuery({
    queryKey: ['admin-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('*, job:jobs(*)')
        .order('applied_date', { ascending: false });
      
      if (error) throw error;
      return data as (Application & { job: Job })[];
    },
  });

  const totalJobs = jobs?.length || 0;
  const activeJobs = jobs?.filter((j) => j.status === 'Open').length || 0;
  const totalApplications = applications?.length || 0;
  const recentApplications = applications?.filter(
    (a) => new Date(a.applied_date) > subDays(new Date(), 7)
  ).length || 0;

  const latestApplications = applications?.slice(0, 5) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your recruitment activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Jobs"
          value={totalJobs}
          icon={Briefcase}
          description="All time job postings"
        />
        <StatsCard
          title="Active Jobs"
          value={activeJobs}
          icon={TrendingUp}
          description="Currently accepting applications"
        />
        <StatsCard
          title="Total Applications"
          value={totalApplications}
          icon={Users}
          description="All time applications received"
        />
        <StatsCard
          title="New This Week"
          value={recentApplications}
          icon={Clock}
          description="Applications in last 7 days"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border border-border/50 hover:border-primary/20 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Post New Job</h3>
                <p className="text-sm text-muted-foreground">
                  Create a new job listing
                </p>
              </div>
              <Button asChild size="sm">
                <Link to="/admin/jobs/new">
                  Create
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 hover:border-primary/20 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Manage Jobs</h3>
                <p className="text-sm text-muted-foreground">
                  Edit or close existing jobs
                </p>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link to="/admin/jobs">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 hover:border-primary/20 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">All Applications</h3>
                <p className="text-sm text-muted-foreground">
                  Review candidate applications
                </p>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link to="/admin/applications">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications Table */}
      <Card className="border border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Applications</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin/applications">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {latestApplications.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestApplications.map((application) => (
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
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No applications yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
