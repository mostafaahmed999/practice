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

import { AuthService } from '../../../core/services/auth.service';
import { FlashMessageService } from '../../../core/services/flash-message.service';
import { AuthValidators } from '../../../core/utils/validators.util';
import { UserDataService } from '../../../core/services/user-data.service';

/**
 * Register Component
 * Handles new user registration with comprehensive validation
 * Includes password strength indicator and real-time validation feedback
 */

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit, OnDestroy {
  // Services
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly flash = inject(FlashMessageService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly userDataService = inject(UserDataService);

  // Form and state
  registerForm!: FormGroup;
  globalError: string | null = null;
  showPassword = false;
  showConfirmPassword = false;
  isSubmitting = false;
  passwordStrength = 0;
  passwordStrengthLabel = 'Weak';

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
    this.registerForm = this.fb.group(
      {
        fullName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
            AuthValidators.name
          ]
        ],
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
            Validators.minLength(6),
            AuthValidators.basicPassword
          ]
        ],
        confirmPassword: [
          '',
          [
            Validators.required
          ]
        ],
        phoneNumber: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            AuthValidators.phoneNumber
          ]
        ],
        agreeTerms: [
          false,
          [Validators.requiredTrue]
        ]
      },
      {
        validators: AuthValidators.matchFields('password', 'confirmPassword')
      }
    );
  }

  /**
   * Setup form value change listener for real-time validation feedback
   */
  private setupFormValueChangeListener(): void {
    // Listen to password changes to calculate strength
    this.registerForm.get('password')?.valueChanges
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe((password) => {
        this.updatePasswordStrength(password);
        this.cdr.markForCheck();
      });

    // Listen to form status changes
    this.registerForm.statusChanges
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

    // Check length
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (password.length >= 14) strength++;

    // Check character types
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    this.passwordStrength = Math.min(strength, 4); // Max 4 levels

    // Set label
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
    const control = this.registerForm.get(fieldName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    return AuthValidators.getErrorMessage(fieldName, control.errors);
  }

  /**
   * Check if field has error and is touched
   */
  hasError(fieldName: string): boolean {
    const control = this.registerForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  /**
   * Check if field is valid
   */
  isFieldValid(fieldName: string): boolean {
    const control = this.registerForm.get(fieldName);
    return !!(control && control.valid && control.touched);
  }

  /**
   * Check if passwords match
   */
  doPasswordsMatch(): boolean {
    if (!this.registerForm) return false;
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
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
    // Mark all fields as touched to show validation errors
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      this.globalError = 'Please fix the errors in the form';
      this.cdr.markForCheck();
      return;
    }

    this.globalError = null;
    this.isSubmitting = true;
    this.cdr.markForCheck();

    const { fullName, email, password, confirmPassword, phoneNumber } = this.registerForm.value;

    this.authService.register({ fullName, email, password, confirmPassword, phoneNumber }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        // Store registration data in UserDataService for profile page
        this.userDataService.setUserData({
          fullName,
          email,
          phoneNumber,
          avatar: '',
          bio: '',
          address: '',
          city: '',
          country: ''
        });

        this.flash.showSuccess('Account created successfully! ✔');

        // Navigate after a short delay for UX
        setTimeout(() => {
          this.router.navigate(['/register-success']);
        }, 500);
      },
      error: (error) => {
        this.isSubmitting = false;

        if (error?.message) {
          this.globalError = error.message;
          this.flash.showError(error.message);
        } else {
          this.globalError = 'An unexpected error occurred. Please try again.';
          this.flash.showError('Registration failed. Please try again.');
        }

        this.cdr.markForCheck();
      }
    });
  }

  /**
   * Navigate to login page
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

