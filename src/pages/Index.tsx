import { Link } from 'react-router-dom';
import { ArrowRight, Users, Rocket, Target, BookOpen, Briefcase, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/types/database';
import { formatDistanceToNow } from 'date-fns';

const benefits = [
  {
    icon: Rocket,
    title: 'Growth-focused Culture',
    description: 'Accelerate your career with clear growth paths and continuous learning opportunities.',
  },
  {
    icon: Target,
    title: 'Real-world Projects',
    description: 'Work on meaningful projects that impact thousands of users globally.',
  },
  {
    icon: Users,
    title: 'Transparent Hiring',
    description: 'Our hiring process is straightforward, fair, and respectful of your time.',
  },
  {
    icon: BookOpen,
    title: 'Learning & Mentorship',
    description: 'Get paired with experienced mentors and access to learning resources.',
  },
];

export default function Index() {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['latest-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'Open')
        .order('posted_date', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      return data as Job[];
    },
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-foreground min-h-[92vh] flex items-center">
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `linear-gradient(hsl(var(--background)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--background)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-background/[0.03] blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-background/[0.04] blur-3xl" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Top bar */}
            <div className="flex items-center gap-4 mb-16 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              <div className="h-px flex-1 bg-background/10" />
              <div className="flex items-center gap-2 text-background/50 text-xs uppercase tracking-[0.3em] font-sans">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-background/60 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-background/80" />
                </span>
                Now Hiring
              </div>
              <div className="h-px flex-1 bg-background/10" />
            </div>

            {/* Main heading — left-aligned, editorial style */}
            <div className="space-y-8">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-background leading-[0.95] tracking-tighter opacity-0 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'forwards', animationDuration: '0.6s' }}>
                Build the
                <br />
                <span className="italic font-normal text-background/40">future</span> with us
              </h1>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 pt-4 opacity-0 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards', animationDuration: '0.5s' }}>
                <p className="text-base md:text-lg text-background/40 max-w-md leading-relaxed font-sans">
                  Intrasphere Labs is where ambitious minds shape technology that matters. 
                  We're looking for people ready to make an impact.
                </p>
                
                <div className="flex items-center gap-4">
                  <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90 rounded-full px-8 h-14 text-base font-sans">
                    <Link to="/jobs">
                      View Openings
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            </div>
          </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Why Join Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">Why Join Us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Why Join Intrasphere Labs?
            </h2>
          </div>

          <div className="grid gap-px md:grid-cols-2 lg:grid-cols-4 bg-border rounded-xl overflow-hidden">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-background p-8 space-y-4 group hover:bg-muted/50 transition-colors"
              >
                <benefit.icon className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                <h3 className="text-base font-semibold text-foreground font-sans">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Openings Section */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-3">Opportunities</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Latest Openings
              </h2>
            </div>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/jobs">
                View All Jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse border border-border rounded-xl p-6">
                  <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                  <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                  <div className="h-4 bg-muted rounded w-full" />
                </div>
              ))}
            </div>
          ) : jobs && jobs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {jobs.map((job) => (
                <Card 
                  key={job.id} 
                  className="job-card group border border-border hover:border-foreground/20"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <Link 
                          to={`/jobs/${job.id}`}
                          className="text-lg font-semibold text-foreground hover:underline underline-offset-4 transition-colors font-sans"
                        >
                          {job.title}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">{job.department}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0 rounded-full font-sans text-xs">
                        {job.job_type}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-5">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5" />
                        <span>{job.experience_required}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatDistanceToNow(new Date(job.posted_date), { addSuffix: true })}</span>
                      </div>
                    </div>

                    <Button asChild variant="ghost" size="sm" className="group-hover:underline underline-offset-4 -ml-3">
                      <Link to={`/jobs/${job.id}`}>
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border border-border rounded-xl py-20 text-center">
              <Briefcase className="h-10 w-10 mx-auto text-muted-foreground/40 mb-4" strokeWidth={1} />
              <h3 className="text-lg font-semibold text-foreground mb-2 font-sans">
                No openings at the moment
              </h3>
              <p className="text-muted-foreground text-sm">
                Check back soon! We're always growing and adding new positions.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="hero-gradient hero-pattern rounded-2xl overflow-hidden p-12 md:p-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Make an Impact?
            </h2>
            <p className="text-lg text-primary-foreground/50 max-w-xl mx-auto mb-8">
              Join our team of passionate professionals building the future of technology.
            </p>
            <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full px-8">
              <Link to="/jobs">
                Explore Opportunities
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
