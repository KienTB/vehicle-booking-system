"use client";

import { Badge } from "@/components/ui/badge";
import { BookingStatus, InvoiceStatus, PaymentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type StatusType = BookingStatus | InvoiceStatus | PaymentStatus;

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  // Booking statuses
  PENDING: "bg-warning/20 text-warning-foreground border-warning/30",
  CONFIRMED: "bg-success/20 text-success border-success/30",
  CANCELLED: "bg-destructive/20 text-destructive border-destructive/30",
  COMPLETED: "bg-primary/20 text-primary border-primary/30",
  // Invoice statuses
  UNPAID: "bg-warning/20 text-warning-foreground border-warning/30",
  PAID: "bg-success/20 text-success border-success/30",
  // Payment statuses
  FAILED: "bg-destructive/20 text-destructive border-destructive/30",
  REFUNDED: "bg-muted text-muted-foreground border-muted",
};

const statusLabels: Record<StatusType, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  UNPAID: "Unpaid",
  PAID: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(statusStyles[status], className)}
    >
      {statusLabels[status]}
    </Badge>
  );
}
