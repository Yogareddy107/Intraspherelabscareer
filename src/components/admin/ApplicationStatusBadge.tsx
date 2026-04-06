import { Badge } from '@/components/ui/badge';
import { ApplicationStatus } from '@/types/database';
import { cn } from '@/lib/utils';

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
}

const statusStyles: Record<ApplicationStatus, string> = {
  Applied: 'badge-info',
  Shortlisted: 'badge-warning',
  Rejected: 'badge-danger',
  Hired: 'badge-success',
};

export default function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  return (
    <Badge variant="secondary" className={cn('font-medium', statusStyles[status])}>
      {status}
    </Badge>
  );
}
