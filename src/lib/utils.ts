import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parse } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertTo12Hour(time24: string): string {
  const date = parse(time24, 'HH:mm', new Date());
  return format(date, 'h:mm a');
}

export function formatDate(dateString: string): string {
  const date = parse(dateString, 'dd MMM yyyy', new Date());
  return format(date, 'EEEE, MMMM dd, yyyy');
}
