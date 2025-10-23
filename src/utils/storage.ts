/**
 * Safe localStorage Utility Functions
 *
 * Provides type-safe localStorage access with error handling
 * and validation to prevent runtime errors from malicious or
 * corrupted data.
 */

import { logger } from './logger';

/**
 * Safely get an item from localStorage with JSON parsing
 *
 * @param key - The localStorage key
 * @param fallback - Default value to return if key doesn't exist or parsing fails
 * @returns The parsed value or fallback
 *
 * @example
 * const bookings = getStorageItem<Booking[]>('shokha_bookings', []);
 */
export function getStorageItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return fallback;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    logger.error(`Failed to parse localStorage[${key}]:`, error);
    return fallback;
  }
}

/**
 * Safely set an item in localStorage with JSON stringification
 *
 * @param key - The localStorage key
 * @param value - The value to store (will be JSON stringified)
 * @returns true if successful, false otherwise
 *
 * @example
 * setStorageItem('shokha_bookings', bookings);
 */
export function setStorageItem<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    logger.error(`Failed to save to localStorage[${key}]:`, error);
    return false;
  }
}

/**
 * Safely remove an item from localStorage
 *
 * @param key - The localStorage key to remove
 * @returns true if successful, false otherwise
 */
export function removeStorageItem(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    logger.error(`Failed to remove localStorage[${key}]:`, error);
    return false;
  }
}

/**
 * Check if a key exists in localStorage
 *
 * @param key - The localStorage key to check
 * @returns true if the key exists
 */
export function hasStorageItem(key: string): boolean {
  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    logger.error(`Failed to check localStorage[${key}]:`, error);
    return false;
  }
}

/**
 * Clear all items from localStorage
 *
 * @returns true if successful, false otherwise
 */
export function clearStorage(): boolean {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    logger.error('Failed to clear localStorage:', error);
    return false;
  }
}

/**
 * Get all keys from localStorage with a specific prefix
 *
 * @param prefix - The prefix to filter by (e.g., 'shokha_')
 * @returns Array of matching keys
 */
export function getStorageKeys(prefix?: string): string[] {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (!prefix || key.startsWith(prefix))) {
        keys.push(key);
      }
    }
    return keys;
  } catch (error) {
    logger.error('Failed to get localStorage keys:', error);
    return [];
  }
}

/**
 * Safely get an item with validation
 *
 * @param key - The localStorage key
 * @param fallback - Default value to return if validation fails
 * @param validator - Function to validate the parsed value
 * @returns The validated value or fallback
 *
 * @example
 * const bookings = getStorageItemWithValidation<Booking[]>(
 *   'shokha_bookings',
 *   [],
 *   (value) => Array.isArray(value)
 * );
 */
export function getStorageItemWithValidation<T>(
  key: string,
  fallback: T,
  validator: (value: any) => boolean
): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return fallback;
    }
    const parsed = JSON.parse(item);
    if (!validator(parsed)) {
      logger.warn(`localStorage[${key}] failed validation, using fallback`);
      return fallback;
    }
    return parsed as T;
  } catch (error) {
    logger.error(`Failed to parse/validate localStorage[${key}]:`, error);
    return fallback;
  }
}

/**
 * sessionStorage versions of the above functions
 */

export function getSessionItem<T>(key: string, fallback: T): T {
  try {
    const item = sessionStorage.getItem(key);
    if (item === null) {
      return fallback;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    logger.error(`Failed to parse sessionStorage[${key}]:`, error);
    return fallback;
  }
}

export function setSessionItem<T>(key: string, value: T): boolean {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    logger.error(`Failed to save to sessionStorage[${key}]:`, error);
    return false;
  }
}

export function removeSessionItem(key: string): boolean {
  try {
    sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    logger.error(`Failed to remove sessionStorage[${key}]:`, error);
    return false;
  }
}
