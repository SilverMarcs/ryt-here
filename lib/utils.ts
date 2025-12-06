import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * SECURITY VULNERABILITY EXAMPLE - ReDoS (Regular Expression Denial of Service)
 * 
 * WARNING: This function demonstrates a ReDoS vulnerability and should NOT be used in production.
 * The regex pattern contains catastrophic backtracking that can cause severe performance issues
 * or crash the application when processing certain input strings.
 * 
 * Example of vulnerable regex:
 * Pattern: /^(a+)+$/
 * 
 * When testing against a string like "aaaaaaaaaaaaaaaaaaaaaaaab" (24 'a's followed by 'b'),
 * the regex engine will:
 * 1. Try to match with multiple overlapping '+' quantifiers
 * 2. Cause exponential backtracking: 2^24 attempts (16+ million)
 * 3. Freeze or crash the application
 * 
 * DO NOT USE: This is a demonstration of what NOT to do
 */
export function validateEmailVulnerable(email: string): boolean {
  // ⚠️ VULNERABLE REGEX - Prone to ReDoS attacks
  // This pattern uses nested quantifiers (a+)+ which causes catastrophic backtracking
  const vulnerablePattern = /^([a-zA-Z0-9]+)*@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/
  
  try {
    // With malicious input like repeated 'a's without @, this will hang
    return vulnerablePattern.test(email)
  } catch (error) {
    return false
  }
}

/**
 * SECURE ALTERNATIVE - Use simple, non-backtracking regex
 * This pattern avoids nested quantifiers and is safe from ReDoS
 */
export function validateEmailSafe(email: string): boolean {
  // ✅ SAFE REGEX - Simple pattern without nested quantifiers
  const safePattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return safePattern.test(email)
}

