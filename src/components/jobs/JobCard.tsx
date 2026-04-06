import { Link } from 'react-router-dom';
import { MapPin, Clock, Briefcase, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Job } from '@/types/database';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Card className="job-card group border border-border hover:border-foreground/20">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <Link 
                to={`/jobs/${job.id}`}
                className="text-lg font-semibold text-foreground hover:underline underline-offset-4 transition-colors font-sans"
              >
                {job.title}
              </Link>
              <p className="text-sm text-muted-foreground">{job.department}</p>
            </div>
            <Badge variant="outline" className="shrink-0 rounded-full font-sans text-xs">
              {job.job_type}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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
              <span>Posted {formatDistanceToNow(new Date(job.posted_date), { addSuffix: true })}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {job.description}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            {job.salary && (
              <span className="text-sm font-medium text-foreground font-sans">{job.salary}</span>
            )}
            <Button 
              asChild 
              variant="ghost" 
              size="sm" 
              className="ml-auto group-hover:underline underline-offset-4"
            >
              <Link to={`/jobs/${job.id}`}>
                View Details
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
