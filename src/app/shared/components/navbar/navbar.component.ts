import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { LanguageService } from '../../core/services/language.service';
import { UserService } from '../../core/services/user.service';
import { NotificationService } from '../../core/services/notification.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { UserMenuDropdownComponent } from '../user-menu-dropdown/user-menu-dropdown.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, UserMenuDropdownComponent],
  template: `
    <!-- Desktop Navbar -->
    <nav class="bg-card border-b border-border sticky top-0 z-50 shadow-sm hidden md:block">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Left Section -->
          <div class="flex items-center gap-6">
            <a routerLink="/" class="flex items-center gap-2 group">
              <div class="bg-primary p-2 rounded-lg transition-transform group-hover:scale-105">
                <span class="text-primary-foreground text-xl">🌿</span>
              </div>
              <span class="text-xl font-bold text-foreground">EcoCollect</span>
            </a>

            @if (userService.isLoggedIn() && !isAuth()) {
              <div class="flex items-center gap-1">
                <a [routerLink]="getDashboardRoute()">
                  <app-button variant="ghost" size="sm">{{ t('dashboard') }}</app-button>
                </a>
                <a routerLink="/my-requests">
                  <app-button variant="ghost" size="sm">{{ t('myRequests') }}</app-button>
                </a>
                <a routerLink="/rewards">
                  <app-button variant="ghost" size="sm">{{ t('rewards') }}</app-button>
                </a>
                @if (userService.hasRole('citizen') && userService.currentRole() !== 'citizen') {
                  <a routerLink="/citizen-dashboard">
                    <app-button variant="ghost" size="sm">{{ t('citizenPanel') }}</app-button>
                  </a>
                }
                @if (userService.hasRole('collector') && userService.currentRole() !== 'collector') {
                  <a routerLink="/collector-dashboard">
                    <app-button variant="ghost" size="sm">{{ t('collectorPanel') }}</app-button>
                  </a>
                }
              </div>
            }
          </div>

          <!-- Right Section -->
          <div class="flex items-center gap-2">
            @if (userService.isLoggedIn()) {
              <a routerLink="/notifications" class="relative">
                <app-button variant="ghost" size="icon">
                  <span>🔔</span>
                  @if (notificationService.unreadCount() > 0) {
                    <span class="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive text-destructive-foreground rounded-full">
                      {{ notificationService.unreadCount() > 9 ? '9+' : notificationService.unreadCount() }}
                    </span>
                  }
                </app-button>
              </a>
            }

            @if (userService.isLoggedIn()) {
              <div class="flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full">
                <span class="text-primary text-sm">🎁</span>
                <span class="text-sm font-medium text-primary">1,250</span>
              </div>
            }

            <app-button variant="ghost" size="icon" (onClick)="languageService.toggleLanguage()" [title]="languageService.language() === 'en' ? 'العربية' : 'English'">
              <span>🌐</span>
            </app-button>

            <app-button variant="ghost" size="icon" (onClick)="themeService.toggleTheme()">
              <span>{{ themeService.theme() === 'light' ? '🌙' : '☀️' }}</span>
            </app-button>

            @if (userService.isLoggedIn()) {
              <app-user-menu-dropdown></app-user-menu-dropdown>
            }

            @if (isLanding() && !userService.isLoggedIn()) {
              <a routerLink="/login">
                <app-button variant="ghost">{{ t('login') }}</app-button>
              </a>
              <a routerLink="/register">
                <app-button>{{ t('getStarted') }}</app-button>
              </a>
            }
          </div>
        </div>
      </div>
    </nav>

    <!-- Mobile Top Bar -->
    <nav class="bg-card border-b border-border sticky top-0 z-50 shadow-sm md:hidden">
      <div class="px-4">
        <div class="flex justify-between items-center h-14">
          <a routerLink="/" class="flex items-center gap-2">
            <div class="bg-primary p-1.5 rounded-lg">
              <span class="text-primary-foreground">🌿</span>
            </div>
            <span class="text-lg font-bold text-foreground">EcoCollect</span>
          </a>

          <div class="flex items-center gap-1">
            <app-button variant="ghost" size="icon" (onClick)="languageService.toggleLanguage()" class="h-9 w-9">
              <span>🌐</span>
            </app-button>
            <app-button variant="ghost" size="icon" (onClick)="themeService.toggleTheme()" class="h-9 w-9">
              <span>{{ themeService.theme() === 'light' ? '🌙' : '☀️' }}</span>
            </app-button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Mobile Bottom Navigation -->
    @if (userService.isLoggedIn() && !isAuth()) {
      <nav class="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 md:hidden">
        <div class="flex justify-around items-center h-16 px-2">
          <a routerLink="/" [class]="'flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ' + (router.url === '/' ? 'text-primary' : 'text-muted-foreground')">
            <span>🏠</span>
          </a>
          <a routerLink="/my-requests" [class]="'flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ' + (router.url === '/my-requests' ? 'text-primary' : 'text-muted-foreground')">
            <span>📄</span>
          </a>
          <a routerLink="/rewards" [class]="'flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ' + (router.url === '/rewards' ? 'text-primary' : 'text-muted-foreground')">
            <span>🎁</span>
          </a>
          <a routerLink="/notifications" [class]="'relative flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ' + (router.url === '/notifications' ? 'text-primary' : 'text-muted-foreground')">
            <span>🔔</span>
            @if (notificationService.unreadCount() > 0) {
              <span class="absolute -top-0.5 right-0 h-4 w-4 flex items-center justify-center p-0 text-[10px] bg-destructive text-destructive-foreground rounded-full">
                {{ notificationService.unreadCount() > 9 ? '9+' : notificationService.unreadCount() }}
              </span>
            }
          </a>
          <a routerLink="/profile" [class]="'flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ' + (router.url === '/profile' ? 'text-primary' : 'text-muted-foreground')">
            <span>👤</span>
          </a>
        </div>
      </nav>
    }
  `,
  styles: []
})
export class NavbarComponent {
  router = inject(Router);
  themeService = inject(ThemeService);
  languageService = inject(LanguageService);
  userService = inject(UserService);
  notificationService = inject(NotificationService);

  t = (key: string) => this.languageService.t(key);

  isLanding = computed(() => this.router.url === '/');
  isAuth = computed(() => {
    const url = this.router.url;
    return url === '/login' || url === '/register' || url === '/role-selection';
  });

  getDashboardRoute(): string {
    const role = this.userService.currentRole();
    if (role === 'collector') return '/collector-dashboard';
    if (role === 'admin') return '/admin-dashboard';
    return '/citizen-dashboard';
  }
}

