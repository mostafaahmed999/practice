import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { UserService } from '../../core/services/user.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../shared/ui/card/card.component';
import { BadgeComponent } from '../../shared/ui/badge/badge.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    BadgeComponent
  ],
  template: `
    <div class="min-h-screen py-8 px-4 md:px-6 lg:px-8 pb-24 md:pb-8">
      <div class="max-w-4xl mx-auto space-y-8">
        <!-- Header -->
        <div>
          <h1 class="text-3xl md:text-4xl font-bold text-foreground">{{ t('profile') }}</h1>
          <p class="text-muted-foreground mt-2">Manage your account information</p>
        </div>

        <!-- Profile Card -->
        <app-card class="shadow-md">
          <app-card-content class="p-6">
            <div class="flex flex-col sm:flex-row items-center gap-6">
              <div class="relative">
                <div class="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <span class="text-white text-4xl">👤</span>
                </div>
                <app-button size="icon" class="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                  <span>📷</span>
                </app-button>
              </div>
              <div class="text-center sm:text-start flex-1">
                <h2 class="text-2xl font-bold text-card-foreground">Ahmed Mohamed</h2>
                <p class="text-muted-foreground">ahmed@example.com</p>
                <div class="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                  <app-badge
                    *ngFor="let role of userService.roles()"
                    [variant]="role === userService.currentRole() ? 'default' : 'secondary'"
                    class="capitalize"
                  >
                    @if (role === userService.currentRole()) {
                      <span>⭐</span>
                    }
                    {{ role }}
                  </app-badge>
                </div>
              </div>
              <app-button variant="outline" class="gap-2">
                <span>✏️</span>
                Edit Profile
              </app-button>
            </div>
          </app-card-content>
        </app-card>

        <!-- Account Information -->
        <app-card class="shadow-md">
          <app-card-header>
            <app-card-title>Account Information</app-card-title>
            <app-card-description>Your personal details</app-card-description>
          </app-card-header>
          <app-card-content class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label for="firstName" class="text-sm font-medium">First Name</label>
                <input id="firstName" value="Ahmed" readonly class="w-full px-3 py-2 border border-input rounded-md bg-muted" />
              </div>
              <div class="space-y-2">
                <label for="lastName" class="text-sm font-medium">Last Name</label>
                <input id="lastName" value="Mohamed" readonly class="w-full px-3 py-2 border border-input rounded-md bg-muted" />
              </div>
              <div class="space-y-2">
                <label for="email" class="flex items-center gap-2 text-sm font-medium">
                  <span>📧</span>
                  Email
                </label>
                <input id="email" value="ahmed@example.com" readonly class="w-full px-3 py-2 border border-input rounded-md bg-muted" />
              </div>
              <div class="space-y-2">
                <label for="phone" class="flex items-center gap-2 text-sm font-medium">
                  <span>📞</span>
                  Phone
                </label>
                <input id="phone" value="+966 5XX XXX XXXX" readonly class="w-full px-3 py-2 border border-input rounded-md bg-muted" />
              </div>
            </div>
            
            <div class="border-t border-border my-4"></div>
            
            <div class="space-y-2">
              <label for="address" class="flex items-center gap-2 text-sm font-medium">
                <span>📍</span>
                Address
              </label>
              <input id="address" value="123 Main Street, Riyadh, Saudi Arabia" readonly class="w-full px-3 py-2 border border-input rounded-md bg-muted" />
            </div>
          </app-card-content>
        </app-card>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <app-card>
            <app-card-content class="p-6 text-center">
              <div class="text-3xl font-bold text-primary">24</div>
              <p class="text-muted-foreground">Total Collections</p>
            </app-card-content>
          </app-card>
          <app-card>
            <app-card-content class="p-6 text-center">
              <div class="text-3xl font-bold text-accent">145 kg</div>
              <p class="text-muted-foreground">CO₂ Saved</p>
            </app-card-content>
          </app-card>
          <app-card>
            <app-card-content class="p-6 text-center">
              <div class="text-3xl font-bold text-primary">1,250</div>
              <p class="text-muted-foreground">Reward Points</p>
            </app-card-content>
          </app-card>
        </div>

        <!-- Security -->
        <app-card class="shadow-md">
          <app-card-header>
            <app-card-title class="flex items-center gap-2">
              <span>🛡️</span>
              Security
            </app-card-title>
            <app-card-description>Manage your account security</app-card-description>
          </app-card-header>
          <app-card-content class="space-y-4">
            <div class="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p class="font-medium text-card-foreground">Password</p>
                <p class="text-sm text-muted-foreground">Last changed 30 days ago</p>
              </div>
              <app-button variant="outline">Change Password</app-button>
            </div>
            <div class="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p class="font-medium text-card-foreground">Two-Factor Authentication</p>
                <p class="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <app-button variant="outline">Enable</app-button>
            </div>
          </app-card-content>
        </app-card>
      </div>
    </div>
  `,
  styles: []
})
export class ProfileComponent {
  languageService = inject(LanguageService);
  userService = inject(UserService);

  t = (key: string) => this.languageService.t(key);
}
