import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly themeKey = 'theme';
  theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    effect(() => {
      const theme = this.theme();
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      localStorage.setItem(this.themeKey, theme);
    });
  }

  private getInitialTheme(): Theme {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.themeKey);
      return (stored as Theme) || 'light';
    }
    return 'light';
  }

  toggleTheme(): void {
    this.theme.update(prev => prev === 'light' ? 'dark' : 'light');
  }
}

