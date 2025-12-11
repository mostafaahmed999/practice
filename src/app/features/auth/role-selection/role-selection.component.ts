import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { UserService } from '../../../core/services/user.service';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4 py-12">
      <div class="max-w-2xl w-full">
        <h1 class="text-3xl md:text-4xl font-bold text-center mb-8">{{ t('selectRole') }}</h1>
        <div class="grid md:grid-cols-2 gap-6">
          <div
            (click)="selectRole('citizen')"
            class="p-8 bg-card rounded-lg border border-border hover:shadow-lg transition-all cursor-pointer"
          >
            <div class="text-6xl mb-4 text-center">👤</div>
            <h2 class="text-2xl font-bold mb-2 text-center">{{ t('citizen') }}</h2>
            <p class="text-muted-foreground text-center mb-4">{{ t('citizenDesc') }}</p>
            <app-button class="w-full">Select</app-button>
          </div>
          <div
            (click)="selectRole('collector')"
            class="p-8 bg-card rounded-lg border border-border hover:shadow-lg transition-all cursor-pointer"
          >
            <div class="text-6xl mb-4 text-center">🚛</div>
            <h2 class="text-2xl font-bold mb-2 text-center">{{ t('collector') }}</h2>
            <p class="text-muted-foreground text-center mb-4">{{ t('collectorDesc') }}</p>
            <app-button class="w-full">Select</app-button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RoleSelectionComponent {
  private router = inject(Router);
  languageService = inject(LanguageService);
  userService = inject(UserService);

  t = (key: string) => this.languageService.t(key);

  selectRole(role: 'citizen' | 'collector'): void {
    this.userService.addRole(role);
    this.userService.setCurrentRole(role);
    if (role === 'citizen') {
      this.router.navigate(['/citizen-dashboard']);
    } else {
      this.router.navigate(['/collector-dashboard']);
    }
  }
}

