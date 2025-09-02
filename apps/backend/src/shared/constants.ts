/**
 * Application-wide constants
 * 
 * This file contains shared constants used across the backend.
 * Update these values here to change behavior throughout the system.
 */

/**
 * Annual vacation days allowed per employee per year
 */
export const ANNUAL_VACATION_DAYS = 26;

/**
 * Maximum length for absence request reason
 */
export const MAX_ABSENCE_REASON_LENGTH = 500;

/**
 * Maximum advance booking period for absence requests (in years)
 */
export const MAX_ADVANCE_BOOKING_YEARS = 1;

/**
 * Application configuration that can be served to frontend
 */
export const APP_CONFIG = {
  annualVacationDays: ANNUAL_VACATION_DAYS,
  maxAbsenceReasonLength: MAX_ABSENCE_REASON_LENGTH,
  maxAdvanceBookingYears: MAX_ADVANCE_BOOKING_YEARS,
} as const;
