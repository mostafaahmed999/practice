import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ChangeDetectorRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

import { AuthService } from '../../../core/services/auth.service';
import { FlashMessageService } from '../../../core/services/flash-message.service';
import { AuthValidators } from '../../../core/utils/validators.util';

/**
 * Login Component
 * Handles user authentication with email and password
 * Includes form validation, error handling, and loading states
 */

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, OnDestroy {
  // Services
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly flash = inject(FlashMessageService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  // Form and state
  loginForm!: FormGroup;
  globalError: string | null = null;
  showPassword = false;
  isSubmitting = false;

  // Cleanup
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormValueChangeListener();

    // Redirect if already logged in
    if (this.authService.isLogged()) {
      this.router.navigate(['/citizen/dashboard']);
    }
  }

  /**
   * Initialize reactive form with validation
   */
  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          AuthValidators.email
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],
      rememberMe: [false]
    });
  }

  /**
   * Setup form value change listener for real-time validation feedback
   */
  private setupFormValueChangeListener(): void {
    this.loginForm.statusChanges
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }

  /**
   * Get field error message
   */
  getErrorMessage(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    return AuthValidators.getErrorMessage(fieldName, control.errors);
  }

  /**
   * Check if field has error and is touched
   */
  hasError(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  /**
   * Check if field is valid
   */
  isFieldValid(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    return !!(control && control.valid && control.touched);
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    // Mark all fields as touched to show validation errors
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      this.globalError = 'Please fix the errors in the form';
      this.cdr.markForCheck();
      return;
    }

    this.globalError = null;
    this.isSubmitting = true;
    this.cdr.markForCheck();

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (token) => {
        try {
          this.authService.saveToken(token);
          this.flash.showSuccess('Welcome back! 🎉');

          // Navigate after a short delay for UX
          setTimeout(() => {
            this.router.navigate(['/citizen/dashboard']);
          }, 500);
        } catch (error) {
          this.globalError = 'Failed to save authentication token';
          this.isSubmitting = false;
          this.cdr.markForCheck();
        }
      },
      error: (error) => {
        this.isSubmitting = false;

        if (error?.message) {
          this.globalError = error.message;
          this.flash.showError(error.message);
        } else {
          this.globalError = 'An unexpected error occurred. Please try again.';
          this.flash.showError('Login failed. Please try again.');
        }

        this.cdr.markForCheck();
      }
    });
  }

  /**
   * Navigate to registration page
   */
  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  /**
   * Navigate to forgot password page
   */
  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  /**
   * Clear global error message
   */
  clearError(): void {
    this.globalError = null;
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

