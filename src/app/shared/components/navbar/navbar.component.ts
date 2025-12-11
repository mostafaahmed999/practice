import { Component, inject, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { LanguageService } from '../../../core/services/language.service';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';
import { UserDataService } from '../../../core/services/user-data.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  router = inject(Router);
  themeService = inject(ThemeService);
  languageService = inject(LanguageService);
  userService = inject(UserService);
  notificationService = inject(NotificationService);
  authService = inject(AuthService);
  dataService = inject(DataService);
  userDataService = inject(UserDataService);

  // UI State
  showUserMenu = signal(false);
  showNotificationsDropdown = signal(false);

  // Computed
  isLoggedIn = this.authService.isLogged;
  userPoints = computed(() => this.dataService.currentUser().points);
  unreadNotifications = this.notificationService.unreadCount;
  
  // User data from registration/profile
  userData = this.userDataService.userData;
  displayName = computed(() => this.userData()?.fullName || this.dataService.currentUser().name || 'User');

  isAuthRoute = computed(() => {
    const url = this.router.url;
    return url.includes('/login') || 
           url.includes('/register') || 
           url.includes('/forgot-password') ||
           url.includes('/reset-password') ||
           url.includes('/confirm-email') ||
           url.includes('/register-success');
  });

  isLandingRoute = computed(() => {
    return this.router.url === '/' || this.router.url === '';
  });

  // Methods
  getDashboardRoute(): string {
    const role = this.userService.currentRole();
    if (role === 'collector') return '/collector-dashboard';
    if (role === 'admin') return '/admin/dashboard';
    return '/citizen-dashboard';
  }

  toggleUserMenu() {
    this.showUserMenu.update(v => !v);
    this.showNotificationsDropdown.set(false);
  }

  toggleNotifications() {
    this.showNotificationsDropdown.update(v => !v);
    this.showUserMenu.set(false);
  }

  closeDropdowns() {
    this.showUserMenu.set(false);
    this.showNotificationsDropdown.set(false);
  }

  switchRole(role: string) {
    this.userService.setCurrentRole(role as 'citizen' | 'collector' | 'admin');
    this.closeDropdowns();
    this.router.navigate([this.getDashboardRoute()]);
  }

  logout() {
    this.authService.logout();
    this.closeDropdowns();
  }

  isActiveRoute(route: string): boolean {
    if (route === '/') {
      return this.router.url === '/' || this.router.url === '';
    }
    return this.router.url.startsWith(route);
  }
}

