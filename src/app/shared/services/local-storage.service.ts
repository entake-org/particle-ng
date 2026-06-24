import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Wrapper around interactions with Local Storage. Handles serializing things to JSON to make it easier to push
 * more complex data into local storage.
 */
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private platformId = inject(PLATFORM_ID);

  private storage!: Storage;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.storage = window.localStorage;
    } else {
      this.storage = this.createMockStorage();
    }
  }

  /**
   * Retrieve an object from LocalStorage
   *
   * @param key
   */
  getObject<T>(key: string): T | null {
    const obj = this.storage.getItem(key);
    if (obj) {
      try {
        return JSON.parse(obj) as T;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  /**
   * Get straight text out of local storage. Don't use this if the data is a JSON Object.
   *
   * @param key
   */
  getText(key: string): string {
    const value = this.storage.getItem(key);
    return value !== null ? value : '';
  }

  /**
   * Puts an object into Local Storage. Handles stringifying the JS Object.
   *
   * @param key
   * @param object
   */
  putObject(key: string, object: any): void {
    this.storage.setItem(key, JSON.stringify(object));
  }

  /**
   * Puts text into Local Storage.
   *
   * @param key
   * @param value
   */
  putText(key: string, value: string): void {
    this.storage.setItem(key, value);
  }

  /**
   * Removes an item from local storage based on the key.
   *
   * @param key
   */
  remove(key: string): void {
    this.storage.removeItem(key);
  }

  /**
   * Creates a safe, transient in-memory Storage implementation for Node.js
   */
  private createMockStorage(): Storage {
    const cache = new Map<string, string>();
    return {
      length: 0,
      clear: () => cache.clear(),
      getItem: (key: string) => cache.get(key) ?? null,
      key: (index: number) => Array.from(cache.keys())[index] ?? null,
      removeItem: (key: string) => cache.delete(key),
      setItem: (key: string, value: string) => cache.set(key, value)
    };
  }

}
