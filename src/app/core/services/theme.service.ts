import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  isDarkMode = signal<boolean>(true);

  constructor() {
    effect(() => {
      const element = document.querySelector('html');
      if (element) {
        if (this.isDarkMode()) {
          element.classList.add('my-app-dark');
        } else {
          element.classList.remove('my-app-dark');
        }
      }
    });
  }

  toggleTheme() {
    this.isDarkMode.update((v) => !v);
  }
}
