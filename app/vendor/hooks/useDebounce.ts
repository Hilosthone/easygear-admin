'use client'

import { useState, useEffect } from 'react'

/**
 * Custom hook to delay the execution of a value change.
 * Useful for search inputs to prevent excessive API calls.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set a timer to update the value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Clean up the timer if the value changes before the delay is finished
    // This is what prevents the API call from firing too early
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
