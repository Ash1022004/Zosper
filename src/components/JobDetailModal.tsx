import { Job } from '@/types/job';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Briefcase, Calendar, DollarSign, Mail, Share2, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface JobDetailModalProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const JobDetailModal = ({ job, open, onOpenChange }: JobDetailModalProps) => {
  if (!job) return null;

  const handleApply = () => {
    if (job.contactEmail) {
      window.location.href = `mailto:${job.contactEmail}?subject=Application for ${job.title}`;
    } else if (job.contactWhatsApp) {
      window.open(`https://wa.me/${job.contactWhatsApp.replace(/[^0-9]/g, '')}`, '_blank');
    }
    toast.success('Opening application method...');
  };

  const handleShare = (platform: 'linkedin' | 'whatsapp') => {
    const url = window.location.href;
    const text = `Check out this job: ${job.title} at ${job.company}`;
    
    if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    }
    toast.success('Opening share dialog...');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start gap-4 mb-4">
            <div>
              <DialogTitle className="text-2xl mb-2">{job.title}</DialogTitle>
              <DialogDescription className="text-lg font-semibold text-foreground">
                {job.company}
              </DialogDescription>
            </div>
            <Badge variant="secondary" className="shrink-0">
              {job.jobType}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="w-4 h-4 text-primary" />
              <span>{job.experience}</span>
            </div>
            {job.salary && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="w-4 h-4 text-secondary" />
                <span className="font-semibold text-secondary">{job.salary}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{formatDistanceToNow(job.datePosted, { addSuffix: true })}</span>
            </div>
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">Job Description</h3>
            <p className="text-muted-foreground leading-relaxed">{job.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">Requirements</h3>
            <ul className="space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-muted-foreground">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">Responsibilities</h3>
            <ul className="space-y-2">
              {job.responsibilities.map((resp, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-muted-foreground">{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {job.benefits && job.benefits.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Benefits</h3>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((benefit, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {benefit}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">Contact Information</h3>
            <div className="space-y-2">
              {job.contactEmail && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>{job.contactEmail}</span>
                </div>
              )}
              {job.contactWhatsApp && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageCircle className="w-4 h-4 text-secondary" />
                  <span>{job.contactWhatsApp}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleApply}
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
              size="lg"
            >
              Apply Now
            </Button>
            <Button
              onClick={() => handleShare('linkedin')}
              variant="outline"
              size="lg"
            >
              <Share2 className="w-4 h-4 mr-2" />
              LinkedIn
            </Button>
            <Button
              onClick={() => handleShare('whatsapp')}
              variant="outline"
              size="lg"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
