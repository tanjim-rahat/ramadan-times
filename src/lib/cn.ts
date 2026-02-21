/**
 * Utility function to merge class names
 * Example usage with the @/lib/* alias
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
