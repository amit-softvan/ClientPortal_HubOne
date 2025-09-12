import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  value: string | number;
  label: string;
  icon: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function MetricCard({ value, label, icon, className, onClick }: MetricCardProps) {
  return (
    <div 
      className={cn("dashboard-card p-6", onClick && "cursor-pointer", className)}
      onClick={onClick}
      data-testid={`metric-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="metric-value">{value}</div>
          <div className="metric-label">{label}</div>
        </div>
        <div className="text-4xl opacity-80">
          {icon}
        </div>
      </div>
    </div>
  );
}
