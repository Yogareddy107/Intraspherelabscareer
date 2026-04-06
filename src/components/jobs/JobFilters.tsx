import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface JobFiltersProps {
  search: string;
  department: string;
  experience: string;
  jobType: string;
  location: string;
  departments: string[];
  onSearchChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onExperienceChange: (value: string) => void;
  onJobTypeChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onClearFilters: () => void;
}

export default function JobFilters({
  search,
  department,
  experience,
  jobType,
  location,
  departments,
  onSearchChange,
  onDepartmentChange,
  onExperienceChange,
  onJobTypeChange,
  onLocationChange,
  onClearFilters,
}: JobFiltersProps) {
  const hasFilters = search || department || experience || jobType || location;

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search jobs by title, skills, or keywords..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 form-input-focus"
        />
      </div>

      {/* Filters Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Select value={department} onValueChange={onDepartmentChange}>
          <SelectTrigger className="form-input-focus">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={experience} onValueChange={onExperienceChange}>
          <SelectTrigger className="form-input-focus">
            <SelectValue placeholder="All Experience Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Experience Levels</SelectItem>
            <SelectItem value="Fresher">Fresher</SelectItem>
            <SelectItem value="1-3 years">1-3 years</SelectItem>
            <SelectItem value="3-5 years">3-5 years</SelectItem>
            <SelectItem value="5+ years">5+ years</SelectItem>
          </SelectContent>
        </Select>

        <Select value={jobType} onValueChange={onJobTypeChange}>
          <SelectTrigger className="form-input-focus">
            <SelectValue placeholder="All Job Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Job Types</SelectItem>
            <SelectItem value="Full-time">Full-time</SelectItem>
            <SelectItem value="Internship">Internship</SelectItem>
            <SelectItem value="Part-time">Part-time</SelectItem>
            <SelectItem value="Contract">Contract</SelectItem>
          </SelectContent>
        </Select>

        <Select value={location} onValueChange={onLocationChange}>
          <SelectTrigger className="form-input-focus">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="Remote">Remote</SelectItem>
            <SelectItem value="Onsite">Onsite</SelectItem>
            <SelectItem value="Hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
