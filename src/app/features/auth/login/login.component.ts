import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { UserService } from '../../core/services/user.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4 py-12 pb-24 md:pb-12">
      <div class="w-full max-w-md shadow-lg bg-card rounded-lg border border-border p-6">
        <div class="text-center mb-6">
          <div class="mx-auto bg-primary p-3 rounded-xl mb-4 w-fit">
            <span class="text-primary-foreground text-2xl">🌿</span>
          </div>
          <h2 class="text-2xl font-bold">{{ t('login') }}</h2>
          <p class="text-muted-foreground mt-2">Welcome back to EcoCollect</p>
        </div>
        <form [formGroup]="loginForm" (ngSubmit)="handleLogin()" class="space-y-5">
          <div class="space-y-2">
            <label for="email" class="text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="you@example.com"
              class="w-full px-3 py-2 border border-input rounded-md bg-background"
            />
          </div>
          <div class="space-y-2">
            <label for="password" class="text-sm font-medium">Password</label>
            <div class="relative">
              <input
                id="password"
                [type]="showPassword ? 'text' : 'password'"
                formControlName="password"
                placeholder="••••••••"
                class="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
              <button
                type="button"
                (click)="showPassword = !showPassword"
                class="absolute right-0 top-0 h-full px-3 text-muted-foreground"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
          </div>
          <app-button type="submit" class="w-full">{{ t('login') }}</app-button>
          <p class="text-center text-sm text-muted-foreground">
            Don't have an account? <a routerLink="/register" class="text-primary hover:underline">{{ t('register') }}</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  languageService = inject(LanguageService);
  userService = inject(UserService);

  t = (key: string) => this.languageService.t(key);
  showPassword = false;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  handleLogin(): void {
    if (this.loginForm.valid) {
      this.userService.login(['citizen']);
      this.router.navigate(['/citizen-dashboard']);
    }
  }
}

