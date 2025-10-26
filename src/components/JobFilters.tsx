import { JobFilters as JobFiltersType } from '@/types/job';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

interface JobFiltersProps {
  filters: JobFiltersType;
  onFilterChange: (filters: JobFiltersType) => void;
}

const locations = ['All Locations', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai'];
const jobTypes = ['All Types', 'Full-time', 'Internship', 'Contract', 'Part-time'];
const experienceLevels = ['All Levels', '0-1 years', '2-4 years', '3-5 years', '4-7 years', '5-8 years'];
const datePosted = ['Anytime', 'Last 24 hours', 'Last 3 days', 'Last 7 days', 'Last 30 days'];

export const JobFilters = ({ filters, onFilterChange }: JobFiltersProps) => {
  const handleReset = () => {
    onFilterChange({
      location: '',
      jobType: '',
      experienceLevel: '',
      datePosted: '',
      searchQuery: ''
    });
  };

  const hasActiveFilters = filters.location || filters.jobType || filters.experienceLevel || filters.datePosted || filters.searchQuery;

  return (
    <Card className="p-6 sticky top-6 bg-gradient-to-br from-card to-muted/20">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Filters</h2>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Reset
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search" className="text-foreground font-semibold">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Job title, company..."
                value={filters.searchQuery}
                onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-foreground font-semibold">Location</Label>
            <Select value={filters.location} onValueChange={(value) => onFilterChange({ ...filters, location: value === 'All Locations' ? '' : value })}>
              <SelectTrigger id="location">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobType" className="text-foreground font-semibold">Job Type</Label>
            <Select value={filters.jobType} onValueChange={(value) => onFilterChange({ ...filters, jobType: value === 'All Types' ? '' : value })}>
              <SelectTrigger id="jobType">
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                {jobTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience" className="text-foreground font-semibold">Experience Level</Label>
            <Select value={filters.experienceLevel} onValueChange={(value) => onFilterChange({ ...filters, experienceLevel: value === 'All Levels' ? '' : value })}>
              <SelectTrigger id="experience">
                <SelectValue placeholder="Select experience" />
              </SelectTrigger>
              <SelectContent>
                {experienceLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="datePosted" className="text-foreground font-semibold">Date Posted</Label>
            <Select value={filters.datePosted} onValueChange={(value) => onFilterChange({ ...filters, datePosted: value === 'Anytime' ? '' : value })}>
              <SelectTrigger id="datePosted">
                <SelectValue placeholder="Select date" />
              </SelectTrigger>
              <SelectContent>
                {datePosted.map((date) => (
                  <SelectItem key={date} value={date}>
                    {date}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
};
