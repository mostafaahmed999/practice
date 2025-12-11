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
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

import { AuthService } from '../../../core/services/auth.service';
import { FlashMessageService } from '../../../core/services/flash-message.service';
import { AuthValidators } from '../../../core/utils/validators.util';

/**
 * Reset Password Component
 * Handles password reset with token validation
 * Displays confirmation after successful password change
 */

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  // Services
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly flash = inject(FlashMessageService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  // Form and state
  resetForm!: FormGroup;
  email: string | null = null;
  token: string | null = null;
  globalError: string | null = null;
  invalidLink = false;
  isSubmitting = false;
  isSubmitted = false;
  showPassword = false;
  showConfirmPassword = false;
  passwordStrength = 0;
  passwordStrengthLabel = 'Weak';

  // Cleanup
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.extractParams();
    
    if (this.invalidLink) {
      this.cdr.markForCheck();
      return;
    }

    this.initializeForm();
    this.setupFormValueChangeListener();
  }

  /**
   * Extract email and token from query parameters
   */
  private extractParams(): void {
    this.email = this.route.snapshot.queryParamMap.get('email');
    const rawToken = this.route.snapshot.queryParamMap.get('token');

    if (!this.email || !rawToken) {
      this.invalidLink = true;
      this.globalError = 'Invalid or expired reset link. Please request a new one.';
      return;
    }

    this.token = encodeURIComponent(rawToken);
  }

  /**
   * Initialize reactive form with validation
   */
  private initializeForm(): void {
    this.resetForm = this.fb.group(
      {
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            AuthValidators.basicPassword
          ]
        ],
        confirmPassword: [
          '',
          [
            Validators.required
          ]
        ]
      },
      {
        validators: AuthValidators.matchFields('newPassword', 'confirmPassword')
      }
    );
  }

  /**
   * Setup form value change listener
   */
  private setupFormValueChangeListener(): void {
    // Listen to password changes
    this.resetForm.get('newPassword')?.valueChanges
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe((password) => {
        this.updatePasswordStrength(password);
        this.cdr.markForCheck();
      });

    // Listen to form status changes
    this.resetForm.statusChanges
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }

  /**
   * Update password strength indicator
   */
  private updatePasswordStrength(password: string): void {
    if (!password) {
      this.passwordStrength = 0;
      this.passwordStrengthLabel = 'Weak';
      return;
    }

    let strength = 0;

    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (password.length >= 14) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    this.passwordStrength = Math.min(strength, 4);

    switch (this.passwordStrength) {
      case 0:
      case 1:
        this.passwordStrengthLabel = 'Weak';
        break;
      case 2:
        this.passwordStrengthLabel = 'Fair';
        break;
      case 3:
        this.passwordStrengthLabel = 'Good';
        break;
      case 4:
        this.passwordStrengthLabel = 'Strong';
        break;
    }
  }

  /**
   * Get password strength color
   */
  getPasswordStrengthColor(): string {
    switch (this.passwordStrength) {
      case 0:
      case 1:
        return 'bg-destructive';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-blue-500';
      case 4:
        return 'bg-primary';
      default:
        return 'bg-gray-300';
    }
  }

  /**
   * Get field error message
   */
  getErrorMessage(fieldName: string): string {
    const control = this.resetForm.get(fieldName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    return AuthValidators.getErrorMessage(fieldName, control.errors);
  }

  /**
   * Check if field has error and is touched
   */
  hasError(fieldName: string): boolean {
    const control = this.resetForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  /**
   * Check if field is valid
   */
  isFieldValid(fieldName: string): boolean {
    const control = this.resetForm.get(fieldName);
    return !!(control && control.valid && control.touched);
  }

  /**
   * Check if passwords match
   */
  doPasswordsMatch(): boolean {
    if (!this.resetForm) return false;
    const password = this.resetForm.get('newPassword')?.value;
    const confirmPassword = this.resetForm.get('confirmPassword')?.value;
    return password && confirmPassword && password === confirmPassword;
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Toggle confirm password visibility
   */
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.resetForm.invalid) {
      Object.keys(this.resetForm.controls).forEach(key => {
        this.resetForm.get(key)?.markAsTouched();
      });
      this.globalError = 'Please fix the errors in the form';
      this.cdr.markForCheck();
      return;
    }

    this.globalError = null;
    this.isSubmitting = true;
    this.cdr.markForCheck();

    const data = {
      email: this.email!,
      token: this.token!,
      newPassword: this.resetForm.get('newPassword')?.value,
      confirmPassword: this.resetForm.get('confirmPassword')?.value
    };

    this.authService.resetPassword(data).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.isSubmitted = true;
        this.flash.showSuccess('Password changed successfully! ✔');
        this.cdr.markForCheck();

        // Redirect after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.isSubmitting = false;

        if (error?.message) {
          this.globalError = error.message;
          this.flash.showError(error.message);
        } else {
          this.globalError = 'Failed to reset password. Please try again.';
          this.flash.showError('Password reset failed.');
        }

        this.cdr.markForCheck();
      }
    });
  }

  /**
   * Navigate to login
   */
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Clear global error
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
