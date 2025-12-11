import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Professional validation utilities for authentication forms
 * Provides reusable validators for email, password, and custom validations
 */

export class AuthValidators {
  /**
   * Email validation pattern
   * Validates standard email format
   */
  // Standard email: local@domain.tld with 2+ char TLD
  private static readonly EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  /**
   * Password strength pattern
   * Requires at least one uppercase, one lowercase, one digit, and one special character
   * Minimum 8 characters
   */
  private static readonly STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  /**
   * Email format validator
   * @param control Form control to validate
   * @returns Validation error object or null
   */
  static email(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Required validator handles empty values
    }

    const isValid = this.EMAIL_REGEX.test(control.value);
    return isValid ? null : { invalidEmail: true };
  }

  /**
   * Strong password validator
   * Requires: uppercase, lowercase, number, special character, min 8 chars
   */
  static strongPassword(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const isValid = this.STRONG_PASSWORD_REGEX.test(control.value);
    return isValid
      ? null
      : {
        weakPassword: {
          required: ['uppercase', 'lowercase', 'number', 'special character'],
          minLength: 8
        }
      };
  }

  /**
   * Basic password validator (now strong by default)
   * Requires: uppercase, lowercase, number, special char, min 8 chars
   */
  static basicPassword(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const value = control.value as string;

    // Length check
    if (value.length < 8) {
      return { minPasswordLength: { requiredLength: 8, actualLength: value.length } };
    }

    // Character class checks
    if (!/[a-z]/.test(value)) {
      return { passwordNoLowercase: true };
    }

    if (!/[A-Z]/.test(value)) {
      return { passwordNoUppercase: true };
    }

    if (!/\d/.test(value)) {
      return { passwordNoNumbers: true };
    }

    if (!/[@$!%*?&]/.test(value)) {
      return { passwordNoSpecial: true };
    }

    return null;
  }

  /**
   * Password strength validator
   * Provides feedback on password strength
   */
  static passwordStrength(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const value = control.value;
    let strength = 0;

    // Check length
    if (value.length >= 8) strength++;
    if (value.length >= 12) strength++;

    // Check character types
    if (/[a-z]/.test(value)) strength++;
    if (/[A-Z]/.test(value)) strength++;
    if (/\d/.test(value)) strength++;
    if (/[@$!%*?&]/.test(value)) strength++;

    // Set validation based on strength
    if (strength < 2) {
      return { weakPassword: true };
    }

    return null;
  }

  /**
   * Minimum password length validator
   */
  static minPasswordLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      return control.value.length >= minLength
        ? null
        : { minPasswordLength: { requiredLength: minLength, actualLength: control.value.length } };
    };
  }

  /**
   * Username validator
   * Alphanumeric and underscores only, 3-20 characters
   */
  static username(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const value = control.value.trim();
    const regex = /^[a-zA-Z0-9_]{3,20}$/;

    if (!regex.test(value)) {
      return { invalidUsername: true };
    }

    return null;
  }

  /**
   * Name validator
   * Only letters, spaces, and hyphens
   */
  static name(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const value = control.value.trim();
    const regex = /^[a-zA-Z\s\-']{2,}$/;

    if (!regex.test(value)) {
      return { invalidName: true };
    }

    return null;
  }

  /**
   * Match fields validator (e.g., password and confirm password)
   * Used with form group validation
   */
  static matchFields(fieldName1: string, fieldName2: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const control1 = group.get(fieldName1);
      const control2 = group.get(fieldName2);

      if (!control1 || !control2) {
        return null;
      }

      if (control1.value !== control2.value) {
        control2.setErrors({ fieldsNotMatching: true });
        return { fieldsNotMatching: true };
      } else {
        // Clear the error if it was previously set
        const errors = control2.errors;
        if (errors) {
          delete errors['fieldsNotMatching'];
          if (Object.keys(errors).length === 0) {
            control2.setErrors(null);
          }
        }
      }

      return null;
    };
  }

  /**
   * No special characters validator
   */
  static noSpecialCharacters(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const regex = /^[a-zA-Z0-9\s\-_.]*$/;
    return regex.test(control.value) ? null : { specialCharacters: true };
  }

  /**
   * URL validator
   */
  static url(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    try {
      new URL(control.value);
      return null;
    } catch {
      return { invalidUrl: true };
    }
  }

  /**
   * Phone number validator
   * Accepts international format
   */
  static phoneNumber(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return regex.test(control.value.replace(/\s/g, '')) ? null : { invalidPhone: true };
  }

  /**
   * Get user-friendly validation error message
   */
  static getErrorMessage(fieldName: string, errors: ValidationErrors | null): string {
    if (!errors) return '';

    const capitalizedField = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

    if (errors['required']) {
      return `${capitalizedField} is required`;
    }
    if (errors['email'] || errors['invalidEmail']) {
      return 'Please enter a valid email address';
    }
    if (errors['minlength']) {
      return `${capitalizedField} must be at least ${errors['minlength'].requiredLength} characters`;
    }
    if (errors['maxlength']) {
      return `${capitalizedField} cannot exceed ${errors['maxlength'].requiredLength} characters`;
    }
    if (errors['pattern']) {
      return `${capitalizedField} format is invalid`;
    }
    if (errors['weakPassword']) {
      return 'Password must contain uppercase, lowercase, number, and special character';
    }
    if (errors['minPasswordLength']) {
      return `Password must be at least ${errors['minPasswordLength'].requiredLength} characters`;
    }
    if (errors['passwordNoLowercase']) {
      return 'Password must contain a lowercase letter';
    }
    if (errors['passwordNoUppercase']) {
      return 'Password must contain an uppercase letter';
    }
    if (errors['passwordNoNumbers']) {
      return 'Password must contain at least one number';
    }
    if (errors['passwordNoSpecial']) {
      return 'Password must contain a special character (@$!%*?&)';
    }
    if (errors['invalidUsername']) {
      return 'Username must be 3-20 characters (letters, numbers, underscores only)';
    }
    if (errors['invalidName']) {
      return 'Name can only contain letters, spaces, and hyphens';
    }
    if (errors['fieldsNotMatching']) {
      return 'Fields do not match';
    }
    if (errors['specialCharacters']) {
      return 'Special characters are not allowed';
    }
    if (errors['invalidUrl']) {
      return 'Please enter a valid URL';
    }
    if (errors['invalidPhone']) {
      return 'Please enter a valid phone number';
    }

    return 'This field is invalid';
  }
}
