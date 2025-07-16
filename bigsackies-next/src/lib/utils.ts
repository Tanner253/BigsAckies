import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Order status helpers
export function isCompletedOrderStatus(status: string): boolean {
  const completedStatuses = ['succeeded', 'paid', 'delivered', 'completed'];
  return completedStatuses.includes(status.toLowerCase());
}

export function getOrderStatusColor(status: string): string {
  return isCompletedOrderStatus(status) ? 'text-green-400' : 'text-red-400';
}

export function getOrderStatusBadgeClasses(status: string): string {
  return isCompletedOrderStatus(status) 
    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
    : 'bg-red-500/20 text-red-400 border border-red-500/30';
}
