import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'completed':
      case 'active':
      case 'verified':
        return 'status-approved';
      case 'denied':
      case 'inactive':
      case 'missed':
        return 'status-denied';
      case 'pending':
      case 'pending_verification':
        return 'status-pending';
      case 'submitted':
        return 'status-submitted';
      default:
        return 'status-pending';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_verification':
        return 'Pending Verification';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <span className={cn("status-badge", getStatusStyles(status), className)} data-testid={`status-${status}`}>
      {getStatusText(status)}
    </span>
  );
}
