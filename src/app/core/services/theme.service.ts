import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly themeKey = 'theme';
  private root: HTMLElement | null = null;
  private lastAppliedTheme: Theme | null = null;
  
  theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    // Initialize root element once
    if (typeof document !== 'undefined') {
      this.root = document.documentElement;
    }
    
    // Optimized effect: only update when theme actually changes
    effect(() => {
      const theme = this.theme();
      
      // Skip if theme hasn't actually changed
      if (theme === this.lastAppliedTheme) return;
      
      this.lastAppliedTheme = theme;
      this.applyTheme(theme);
    });
  }

  private getInitialTheme(): Theme {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.themeKey) as Theme | null;
      if (stored && (stored === 'light' || stored === 'dark')) {
        return stored;
      }
      // Check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }

  private applyTheme(theme: Theme): void {
    if (!this.root) return;
    
    // Use classList.toggle for better performance
    this.root.classList.toggle('dark', theme === 'dark');
    this.root.classList.toggle('light', theme === 'light');
    
    // Batch DOM updates with localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.themeKey, theme);
    }
  }

  toggleTheme(): void {
    this.theme.update(prev => prev === 'light' ? 'dark' : 'light');
  }
  
  setTheme(theme: Theme): void {
    if (theme !== this.lastAppliedTheme) {
      this.theme.set(theme);
    }
  }
  
  getTheme(): Theme {
    return this.theme();
  }
}

