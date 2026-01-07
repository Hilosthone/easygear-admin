import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines multiple Tailwind classes and merges conflicting ones.
 * Example: cn('bg-red-500', 'bg-blue-500') results in 'bg-blue-500'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
