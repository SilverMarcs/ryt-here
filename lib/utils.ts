import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function validateEmailVulnerable(email: string): boolean {
  const vulnerablePattern = /^([a-zA-Z0-9]+)*@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/
  
  try {
    return vulnerablePattern.test(email)
  } catch (error) {
    return false
  }
}

export function validateEmailSafe(email: string): boolean {
  const safePattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return safePattern.test(email)
}

