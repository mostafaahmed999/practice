import {
  Component,
  inject,
  ChangeDetectionStrategy,
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

import { FlashMessageService } from '../../../core/services/flash-message.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuthValidators } from '../../../core/utils/validators.util';

/**
 * Forgot Password Component
 * Handles password reset request with email validation
 * Displays confirmation message after successful submission
 */

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  // Services
  private readonly flash = inject(FlashMessageService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  // Form and state
  forgotPasswordForm!: FormGroup;
  globalError: string | null = null;
  isSubmitting = false;
  isSubmitted = false;
  submittedEmail: string | null = null;

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
    this.forgotPasswordForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          AuthValidators.email
        ]
      ]
    });
  }

  /**
   * Setup form value change listener for real-time validation feedback
   */
  private setupFormValueChangeListener(): void {
    this.forgotPasswordForm.statusChanges
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
    const control = this.forgotPasswordForm.get(fieldName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    return AuthValidators.getErrorMessage(fieldName, control.errors);
  }

  /**
   * Check if field has error and is touched
   */
  hasError(fieldName: string): boolean {
    const control = this.forgotPasswordForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  /**
   * Check if field is valid
   */
  isFieldValid(fieldName: string): boolean {
    const control = this.forgotPasswordForm.get(fieldName);
    return !!(control && control.valid && control.touched);
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    // Mark all fields as touched to show validation errors
    if (this.forgotPasswordForm.invalid) {
      Object.keys(this.forgotPasswordForm.controls).forEach(key => {
        this.forgotPasswordForm.get(key)?.markAsTouched();
      });
      this.globalError = 'Please enter a valid email address';
      this.cdr.markForCheck();
      return;
    }

    this.globalError = null;
    this.isSubmitting = true;
    this.cdr.markForCheck();

    const email = this.forgotPasswordForm.get('email')?.value;

    this.authService.forgotPassword(email).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.isSubmitted = true;
        this.submittedEmail = email;
        this.flash.showSuccess('Password reset link sent to your email! ✔');
        this.cdr.markForCheck();

        // Redirect after 5 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 5000);
      },
      error: (error) => {
        this.isSubmitting = false;

        if (error?.message) {
          this.globalError = error.message;
          this.flash.showError(error.message);
        } else {
          this.globalError = 'Unable to process your request. Please try again.';
          this.flash.showError('Request failed. Please try again.');
        }

        this.cdr.markForCheck();
      }
    });
  }

  /**
   * Navigate back to login
   */
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Clear global error message
   */
  clearError(): void {
    this.globalError = null;
    this.cdr.markForCheck();
  }

  /**
   * Submit another request
   */
  submitAnother(): void {
    this.isSubmitted = false;
    this.submittedEmail = null;
    this.forgotPasswordForm.reset();
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
