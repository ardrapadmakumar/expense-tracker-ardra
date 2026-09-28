import { STORAGE_KEY } from '../config/constants.js';

export class StorageService {
  constructor(key = STORAGE_KEY) {
    this.key = key;
  }

  /** @returns {Array} saved items, or [] if nothing is saved or the data is corrupted */
  load() {
    try {
      const raw = window.localStorage.getItem(this.key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
      return [];
    }
  }

  /** @returns {boolean} true if the data was saved successfully */
  save(items) {
    try {
      window.localStorage.setItem(this.key, JSON.stringify(items));
      return true;
    } catch (error) {
      console.error('Failed to save data to localStorage:', error);
      return false;
    }
  }
}
