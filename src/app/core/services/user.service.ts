import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export type Role = 'citizen' | 'collector' | 'admin';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly rolesKey = 'userRoles';
  private readonly currentRoleKey = 'currentRole';
  
  roles = signal<Role[]>(this.getInitialRoles());
  currentRole = signal<Role | null>(this.getInitialCurrentRole());
  
  isLoggedIn = computed(() => this.roles().length > 0);

  constructor(private router: Router) {}

  private getInitialRoles(): Role[] {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.rolesKey);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  }

  private getInitialCurrentRole(): Role | null {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.currentRoleKey);
      return stored as Role | null;
    }
    return null;
  }

  setCurrentRole(role: Role): void {
    this.currentRole.set(role);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.currentRoleKey, role);
    }
  }

  addRole(role: Role): void {
    const currentRoles = this.roles();
    if (!currentRoles.includes(role)) {
      const newRoles = [...currentRoles, role];
      this.roles.set(newRoles);
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.rolesKey, JSON.stringify(newRoles));
      }
      if (!this.currentRole()) {
        this.setCurrentRole(role);
      }
    }
  }

  hasRole(role: Role): boolean {
    return this.roles().includes(role);
  }

  login(userRoles: Role[]): void {
    this.roles.set(userRoles);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.rolesKey, JSON.stringify(userRoles));
    }
    if (userRoles.length > 0) {
      this.setCurrentRole(userRoles[0]);
    }
  }

  logout(): void {
    this.roles.set([]);
    this.currentRole.set(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.rolesKey);
      localStorage.removeItem(this.currentRoleKey);
      localStorage.removeItem('userRole');
    }
    this.router.navigate(['/']);
  }
}

