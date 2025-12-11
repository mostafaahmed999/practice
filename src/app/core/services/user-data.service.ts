import { Injectable, signal } from '@angular/core';

/**
 * User Data Service
 * Stores user registration/profile data for sharing between components
 */

export interface UserProfileData {
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber: string;
  avatar?: string;
  bio?: string;
  address?: string;
  city?: string;
  country?: string;
  coordinates?: { lat: number; lng: number };
}

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private readonly USER_DATA_KEY = 'user_profile_data';

  // Signal to track user data
  private _userData = signal<UserProfileData | null>(this.getStoredUserData());
  userData = this._userData.asReadonly();

  /**
   * Store user registration data
   */
  setUserData(data: Partial<UserProfileData>): void {
    const current = this._userData() || {
      fullName: '',
      email: '',
      phoneNumber: '',
    };

    const updated: UserProfileData = {
      ...current,
      ...data,
    };

    this._userData.set(updated);
    this.persistUserData(updated);
  }

  /**
   * Get current user data
   */
  getUserData(): UserProfileData | null {
    return this._userData();
  }

  /**
   * Get specific field
   */
  getUserField(field: keyof UserProfileData): any {
    return this._userData()?.[field];
  }

  /**
   * Clear user data
   */
  clearUserData(): void {
    this._userData.set(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.USER_DATA_KEY);
    }
  }

  /**
   * Retrieve stored user data from localStorage
   */
  private getStoredUserData(): UserProfileData | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const stored = localStorage.getItem(this.USER_DATA_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  /**
   * Persist user data to localStorage
   */
  private persistUserData(data: UserProfileData): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to persist user data:', error);
    }
  }
}
