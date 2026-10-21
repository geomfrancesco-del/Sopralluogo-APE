import { ApeInspection } from '../types/ape';
import { INITIAL_INSPECTIONS, createEmptyInspection } from '../data/initialData';

const STORAGE_KEY = 'sopralluogo_ape_v2_data';
const ACTIVE_ID_KEY = 'sopralluogo_ape_v2_active';

export function loadInspectionsFromStorage(): ApeInspection[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INSPECTIONS));
      return INITIAL_INSPECTIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_INSPECTIONS;
  } catch (error) {
    console.error('Error loading inspections from localStorage:', error);
    return [createEmptyInspection()];
  }
}

export function saveInspectionsToStorage(inspections: ApeInspection[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inspections));
  } catch (error) {
    console.error('Error saving inspections to localStorage:', error);
  }
}

export function loadActiveInspectionId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_ID_KEY);
  } catch {
    return null;
  }
}

export function saveActiveInspectionId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_ID_KEY, id);
  } catch {
    // Ignore error
  }
}

