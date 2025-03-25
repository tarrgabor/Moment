import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkTheme = true;

  constructor() {
    this.loadTheme();
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
  }

  private loadTheme(): void {
    const storedTheme = localStorage.getItem('isDarkTheme');
    if (storedTheme !== null) {
      this.isDarkTheme = JSON.parse(storedTheme);
    }
    this.applyTheme();
  }

  private applyTheme(): void {
    const theme = this.isDarkTheme ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('isDarkTheme', JSON.stringify(this.isDarkTheme));
  }
}