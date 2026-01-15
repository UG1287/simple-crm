import { Injectable } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'crm_theme_mode';

  // cached mode so templates don't need document
  private _mode: ThemeMode = 'light';

  init(): void {
    if (!this.isBrowser()) return;

    const saved = this.getSavedMode();
    this.apply(saved);
  }

  toggle(): ThemeMode {
    const next: ThemeMode = this._mode === 'dark' ? 'light' : 'dark';
    this.apply(next);
    return next;
  }

  isDark(): boolean {
    return this._mode === 'dark';
  }

  mode(): ThemeMode {
    return this._mode;
  }

  private apply(mode: ThemeMode): void {
    this._mode = mode;
    if (!this.isBrowser()) return;

    const html = document.documentElement;
    if (mode === 'dark') html.classList.add('theme-dark');
    else html.classList.remove('theme-dark');

    localStorage.setItem(this.storageKey, mode);
  }

  private getSavedMode(): ThemeMode {
    const raw = localStorage.getItem(this.storageKey);
    if (raw === 'dark' || raw === 'light') return raw;

    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }
}
