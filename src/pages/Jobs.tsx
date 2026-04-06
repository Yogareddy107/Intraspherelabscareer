import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/types/database';
import JobCard from '@/components/jobs/JobCard';
import JobFilters from '@/components/jobs/JobFilters';
import { Card, CardContent } from '@/components/ui/card';

export default function Jobs() {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || '';

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [experience, setExperience] = useState('');
  const [jobType, setJobType] = useState(initialType);
  const [location, setLocation] = useState('');

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'Open')
        .order('posted_date', { ascending: false });
      
      if (error) throw error;
      return data as Job[];
    },
  });

  const departments = useMemo(() => {
    if (!jobs) return [];
    return [...new Set(jobs.map((job) => job.department))];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    if (!jobs) return [];

    return jobs.filter((job) => {
      const matchesSearch = !search || 
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase()) ||
        job.skills_required.toLowerCase().includes(search.toLowerCase());

      const matchesDepartment = !department || department === 'all' || job.department === department;
      const matchesExperience = !experience || experience === 'all' || job.experience_required === experience;
      const matchesJobType = !jobType || jobType === 'all' || job.job_type === jobType;
      const matchesLocation = !location || location === 'all' || job.location === location;

      return matchesSearch && matchesDepartment && matchesExperience && matchesJobType && matchesLocation;
    });
  }, [jobs, search, department, experience, jobType, location]);

  const clearFilters = () => {
    setSearch('');
    setDepartment('');
    setExperience('');
    setJobType('');
    setLocation('');
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Join Our Team
          </h1>
          <p className="text-lg text-muted-foreground">
            Find your next opportunity at Intrasphere Labs. We're looking for talented 
            individuals to help us build the future.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <JobFilters
            search={search}
            department={department}
            experience={experience}
            jobType={jobType}
            location={location}
            departments={departments}
            onSearchChange={setSearch}
            onDepartmentChange={setDepartment}
            onExperienceChange={setExperience}
            onJobTypeChange={setJobType}
            onLocationChange={setLocation}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {isLoading ? 'Loading...' : `${filteredJobs.length} position${filteredJobs.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Job Grid */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                  <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                  <div className="h-4 bg-muted rounded w-full mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <Card className="border border-border/50">
            <CardContent className="py-16 text-center">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No matching positions found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or check back later for new opportunities.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
