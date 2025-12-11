import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-menu-dropdown',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="relative">
      <!-- Trigger Button -->
      <button
        type="button"
        (click)="isOpen.set(!isOpen())"
        class="flex items-center justify-center h-10 w-10 rounded-md hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <span class="text-lg">☰</span>
      </button>

      <!-- Dropdown Menu -->
      @if (isOpen()) {
        <div
          class="absolute right-0 top-12 w-56 bg-card rounded-lg border border-border shadow-lg z-50"
          (click)="$event.stopPropagation()"
        >
          <div class="p-1">
            <!-- View Profile -->
            <a
              routerLink="/profile"
              (click)="closeMenu()"
              class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors cursor-pointer"
            >
              <span class="text-lg">👤</span>
              <span class="text-sm font-medium">View Profile</span>
            </a>

            <!-- Add Role (Collector) -->
            @if (!userService.hasRole('collector')) {
              <button
                type="button"
                (click)="addCollectorRole(); closeMenu()"
                class="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors cursor-pointer text-left"
              >
                <span class="text-lg">👤➕</span>
                <span class="text-sm font-medium">Add Role (Collector)</span>
              </button>
            }

            <!-- Settings -->
            <a
              routerLink="/settings"
              (click)="closeMenu()"
              class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors cursor-pointer"
            >
              <span class="text-lg">⚙️</span>
              <span class="text-sm font-medium">Settings</span>
            </a>

            <!-- Divider -->
            <div class="h-px bg-border my-1"></div>

            <!-- Logout -->
            <button
              type="button"
              (click)="handleLogout(); closeMenu()"
              class="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors cursor-pointer text-left text-destructive"
            >
              <span class="text-lg">🚪</span>
              <span class="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class UserMenuDropdownComponent {
  userService = inject(UserService);
  router = inject(Router);
  
  isOpen = signal(false);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('app-user-menu-dropdown')) {
      this.isOpen.set(false);
    }
  }

  closeMenu(): void {
    this.isOpen.set(false);
  }

  addCollectorRole(): void {
    this.userService.addRole('collector');
    this.userService.setCurrentRole('collector');
    this.router.navigate(['/collector-dashboard']);
  }

  handleLogout(): void {
    this.userService.logout();
  }
}
