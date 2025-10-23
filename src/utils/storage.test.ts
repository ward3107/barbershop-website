import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  hasStorageItem,
  clearStorage,
  getStorageKeys,
  getStorageItemWithValidation,
  getSessionItem,
  setSessionItem,
  removeSessionItem,
} from './storage';

describe('Storage Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('getStorageItem', () => {
    it('should return fallback when key does not exist', () => {
      const result = getStorageItem('nonexistent', 'fallback');
      expect(result).toBe('fallback');
    });

    it('should return parsed value when key exists', () => {
      localStorage.setItem('test', JSON.stringify({ foo: 'bar' }));
      const result = getStorageItem<{ foo: string }>('test', { foo: 'default' });
      expect(result).toEqual({ foo: 'bar' });
    });

    it('should return fallback when JSON parsing fails', () => {
      localStorage.setItem('test', 'invalid json {');
      const result = getStorageItem('test', 'fallback');
      expect(result).toBe('fallback');
    });

    it('should handle complex objects', () => {
      const complexObject = {
        id: 1,
        name: 'Test',
        nested: {
          value: 'nested value',
          array: [1, 2, 3],
        },
      };
      localStorage.setItem('complex', JSON.stringify(complexObject));
      const result = getStorageItem('complex', {});
      expect(result).toEqual(complexObject);
    });

    it('should handle arrays', () => {
      const array = [1, 2, 3, 4, 5];
      localStorage.setItem('array', JSON.stringify(array));
      const result = getStorageItem<number[]>('array', []);
      expect(result).toEqual(array);
    });
  });

  describe('setStorageItem', () => {
    it('should store value successfully', () => {
      const result = setStorageItem('test', { foo: 'bar' });
      expect(result).toBe(true);
      expect(localStorage.getItem('test')).toBe(JSON.stringify({ foo: 'bar' }));
    });

    it('should return false on error', () => {
      // Mock setItem to throw error
      vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
        throw new Error('Storage full');
      });

      const result = setStorageItem('test', 'value');
      expect(result).toBe(false);

      vi.restoreAllMocks();
    });

    it('should handle primitive values', () => {
      setStorageItem('string', 'test');
      setStorageItem('number', 42);
      setStorageItem('boolean', true);

      expect(getStorageItem('string', '')).toBe('test');
      expect(getStorageItem('number', 0)).toBe(42);
      expect(getStorageItem('boolean', false)).toBe(true);
    });
  });

  describe('removeStorageItem', () => {
    it('should remove item successfully', () => {
      localStorage.setItem('test', 'value');
      const result = removeStorageItem('test');
      expect(result).toBe(true);
      expect(localStorage.getItem('test')).toBeNull();
    });

    it('should return false on error', () => {
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementationOnce(() => {
        throw new Error('Remove failed');
      });

      const result = removeStorageItem('test');
      expect(result).toBe(false);

      vi.restoreAllMocks();
    });
  });

  describe('hasStorageItem', () => {
    it('should return true when key exists', () => {
      localStorage.setItem('test', 'value');
      expect(hasStorageItem('test')).toBe(true);
    });

    it('should return false when key does not exist', () => {
      expect(hasStorageItem('nonexistent')).toBe(false);
    });

    it('should return false on error', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => {
        throw new Error('Access denied');
      });

      expect(hasStorageItem('test')).toBe(false);

      vi.restoreAllMocks();
    });
  });

  describe('clearStorage', () => {
    it('should clear all items', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');

      const result = clearStorage();
      expect(result).toBe(true);
      expect(localStorage.length).toBe(0);
    });

    it('should return false on error', () => {
      vi.spyOn(Storage.prototype, 'clear').mockImplementationOnce(() => {
        throw new Error('Clear failed');
      });

      const result = clearStorage();
      expect(result).toBe(false);

      vi.restoreAllMocks();
    });
  });

  describe('getStorageKeys', () => {
    it('should return all keys', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      localStorage.setItem('key3', 'value3');

      const keys = getStorageKeys();
      expect(keys).toHaveLength(3);
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
      expect(keys).toContain('key3');
    });

    it('should filter keys by prefix', () => {
      localStorage.setItem('shokha_key1', 'value1');
      localStorage.setItem('shokha_key2', 'value2');
      localStorage.setItem('other_key', 'value3');

      const keys = getStorageKeys('shokha_');
      expect(keys).toHaveLength(2);
      expect(keys).toContain('shokha_key1');
      expect(keys).toContain('shokha_key2');
      expect(keys).not.toContain('other_key');
    });

    it('should return empty array on error', () => {
      vi.spyOn(Storage.prototype, 'key').mockImplementationOnce(() => {
        throw new Error('Access error');
      });

      const keys = getStorageKeys();
      expect(keys).toEqual([]);

      vi.restoreAllMocks();
    });
  });

  describe('getStorageItemWithValidation', () => {
    it('should return value when validation passes', () => {
      localStorage.setItem('array', JSON.stringify([1, 2, 3]));

      const result = getStorageItemWithValidation(
        'array',
        [],
        (value) => Array.isArray(value)
      );

      expect(result).toEqual([1, 2, 3]);
    });

    it('should return fallback when validation fails', () => {
      localStorage.setItem('notArray', JSON.stringify({ foo: 'bar' }));

      const result = getStorageItemWithValidation(
        'notArray',
        [],
        (value) => Array.isArray(value)
      );

      expect(result).toEqual([]);
    });

    it('should return fallback when key does not exist', () => {
      const result = getStorageItemWithValidation(
        'nonexistent',
        'default',
        () => true
      );

      expect(result).toBe('default');
    });

    it('should handle complex validation', () => {
      interface User {
        name: string;
        age: number;
      }

      const user: User = { name: 'John', age: 30 };
      localStorage.setItem('user', JSON.stringify(user));

      const isValidUser = (value: any): boolean => {
        return (
          typeof value === 'object' &&
          typeof value.name === 'string' &&
          typeof value.age === 'number'
        );
      };

      const result = getStorageItemWithValidation<User>(
        'user',
        { name: '', age: 0 },
        isValidUser
      );

      expect(result).toEqual(user);
    });
  });

  describe('sessionStorage utilities', () => {
    it('should get session item', () => {
      sessionStorage.setItem('test', JSON.stringify({ foo: 'bar' }));
      const result = getSessionItem('test', {});
      expect(result).toEqual({ foo: 'bar' });
    });

    it('should set session item', () => {
      const result = setSessionItem('test', { foo: 'bar' });
      expect(result).toBe(true);
      expect(sessionStorage.getItem('test')).toBe(JSON.stringify({ foo: 'bar' }));
    });

    it('should remove session item', () => {
      sessionStorage.setItem('test', 'value');
      const result = removeSessionItem('test');
      expect(result).toBe(true);
      expect(sessionStorage.getItem('test')).toBeNull();
    });

    it('should handle session storage errors gracefully', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
        throw new Error('Session storage error');
      });

      const result = setSessionItem('test', 'value');
      expect(result).toBe(false);

      vi.restoreAllMocks();
    });
  });

  describe('Edge cases', () => {
    it('should handle null values', () => {
      setStorageItem('null', null);
      const result = getStorageItem('null', 'fallback');
      expect(result).toBeNull();
    });

    it('should handle undefined values', () => {
      setStorageItem('undefined', undefined);
      const result = getStorageItem('undefined', 'fallback');
      expect(result).toBeUndefined();
    });

    it('should handle empty strings', () => {
      setStorageItem('empty', '');
      const result = getStorageItem('empty', 'fallback');
      expect(result).toBe('');
    });

    it('should handle empty objects', () => {
      setStorageItem('emptyObj', {});
      const result = getStorageItem('emptyObj', null);
      expect(result).toEqual({});
    });

    it('should handle empty arrays', () => {
      setStorageItem('emptyArray', []);
      const result = getStorageItem('emptyArray', null);
      expect(result).toEqual([]);
    });
  });
});
