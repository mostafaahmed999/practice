import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { API_CONFIG } from '../config/api.config';
import { ApplicationUser } from '../models/application-user.model';

/**
 * Authentication Service
 * Handles user authentication, token management, and auth-related API calls
 */

export interface AuthError {
  code: string;
  message: string;
  statusCode: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  fullName: string;
  phoneNumber: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = `${API_CONFIG.baseUrl}/api/Auth`;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLE_KEY = 'user_role';

  // Signals for reactive state
  private _token = signal<string | null>(this.getToken());
  private _role = signal<string | null>(this.getRole());
  private _user = signal<ApplicationUser | null>(null);
  private _isLoading = signal(false);

  // Computed properties
  token = computed(() => this._token());
  role = computed(() => this._role());
  user = computed(() => this._user());
  isLogged = computed(() => !!this._token());
  isLoading = computed(() => this._isLoading());

  // ===========================
  // AUTH API CALLS
  // ===========================

  /**
   * Register new user
   * @param data Registration data with email, password, fullName
   */
  register(data: RegisterData): Observable<string> {
    this._isLoading.set(true);
    return this.http.post(`${this.apiUrl}/register`, data, { responseType: 'text' }).pipe(
      catchError((error) => this.handleAuthError(error)),
      finalize(() => this._isLoading.set(false))
    );
  }

  /**
   * Login with email and password
   * @param credentials User login credentials
   */
  login(credentials: LoginCredentials): Observable<string> {
    this._isLoading.set(true);
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      map((res) => res.token),
      catchError((error) => this.handleAuthError(error)),
      finalize(() => this._isLoading.set(false))
    );
  }

  /**
   * Request password reset link
   * @param email User email address
   */
  forgotPassword(email: string): Observable<string> {
    this._isLoading.set(true);
    const payload: ForgotPasswordRequest = { email };
    return this.http.post(`${this.apiUrl}/forgot-password`, payload, { responseType: 'text' }).pipe(
      catchError((error) => this.handleAuthError(error)),
      finalize(() => this._isLoading.set(false))
    );
  }

  /**
   * Reset password with token
   * @param data Reset password data with email, token, and new password
   */
  resetPassword(data: ResetPasswordRequest): Observable<string> {
    this._isLoading.set(true);
    return this.http.post(`${this.apiUrl}/reset-password`, data, { responseType: 'text' }).pipe(
      catchError((error) => this.handleAuthError(error)),
      finalize(() => this._isLoading.set(false))
    );
  }

  /**
   * Confirm email with token
   * @param email User email address
   * @param token Email confirmation token
   */
  confirmEmail(email: string, token: string): Observable<string> {
    this._isLoading.set(true);
    const encodedToken = encodeURIComponent(token);
    return this.http.get(
      `${this.apiUrl}/confirm-email?email=${encodeURIComponent(email)}&token=${encodedToken}`,
      { responseType: 'text' }
    ).pipe(
      catchError((error) => this.handleAuthError(error)),
      finalize(() => this._isLoading.set(false))
    );
  }

  // ===========================
  // TOKEN MANAGEMENT
  // ===========================

  /**
   * Save authentication token and update state
   * @param token JWT token from backend
   */
  saveToken(token: string): void {
    if (!token || token.trim() === '') {
      throw new Error('Invalid token provided');
    }

    localStorage.setItem(this.TOKEN_KEY, token);
    this._token.set(token);

    // Extract role from token or set default
    const role = this.extractRoleFromToken(token) || 'Citizen';
    localStorage.setItem(this.ROLE_KEY, role);
    this._role.set(role);

    this._isLoading.set(false);
  }

  /**
   * Get stored authentication token
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  /**
   * Get user role
   */
  getRole(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.ROLE_KEY);
    }
    return null;
  }

  /**
   * Check if token is valid (basic check)
   */
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = this.parseJwt(token);
      const exp = payload?.exp;

      if (!exp) return true; // Assume valid if no expiration

      return Date.now() < exp * 1000;
    } catch {
      return false;
    }
  }

  /**
   * Logout and clear authentication state
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    this._token.set(null);
    this._role.set(null);
    this._user.set(null);
    this._isLoading.set(false);
    this.router.navigate(['/login']);
  }

  /**
   * Set current user
   */
  setUser(user: ApplicationUser): void {
    this._user.set(user);
  }

  /**
   * Get current user
   */
  getUser(): ApplicationUser | null {
    return this._user();
  }

  // ===========================
  // PRIVATE HELPER METHODS
  // ===========================

  /**
   * Extract role from JWT token
   */
  private extractRoleFromToken(token: string): string | null {
    try {
      const payload = this.parseJwt(token);
      return payload?.role || null;
    } catch {
      return null;
    }
  }

  /**
   * Parse JWT token
   */
  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  /**
   * Handle authentication errors with user-friendly messages
   */
  private handleAuthError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An authentication error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = 'Network error. Please check your connection.';
    } else {
      // Server-side error
      const status = error.status;
      const message = error.error;

      if (status === 400) {
        if (typeof message === 'string') {
          if (message.toLowerCase().includes('email')) {
            errorMessage = 'This email is already registered';
          } else if (message.toLowerCase().includes('password')) {
            errorMessage = 'Invalid credentials';
          } else if (message.toLowerCase().includes('match')) {
            errorMessage = 'Passwords do not match';
          } else {
            errorMessage = message;
          }
        } else {
          errorMessage = 'Invalid request. Please check your information.';
        }
      } else if (status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (status === 404) {
        errorMessage = 'User not found';
      } else if (status === 409) {
        errorMessage = 'This email is already registered';
      } else if (status === 422) {
        errorMessage = 'The provided data is invalid';
      } else if (status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (status === 503) {
        errorMessage = 'Service temporarily unavailable';
      } else if (status === 0) {
        errorMessage = 'Network error. Please check your internet connection.';
      }
    }

    const authError: AuthError = {
      code: `AUTH_ERROR_${error.status}`,
      message: errorMessage,
      statusCode: error.status || 0
    };

    return throwError(() => authError);
  }
}
