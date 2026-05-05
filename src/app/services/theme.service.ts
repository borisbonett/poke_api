import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal<boolean>(true);

  toggleTheme(): void {
    const html = document.documentElement;
    if (html.classList.contains('light-mode')) {
      html.classList.remove('light-mode');
      this.isDark.set(true);
    } else {
      html.classList.add('light-mode');
      this.isDark.set(false);
    }
  }
}
