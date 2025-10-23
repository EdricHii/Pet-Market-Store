import { CommonModule } from '@angular/common';
import { Component, inject, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from '../../stores/cart.store';
import { AuthService } from '../../auth/auth';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  cartStore = inject(CartStore);
  previousCount = 0;
  isCartBouncing = false;
  auth = inject(AuthService);
  currentUser$ = this.auth.currentUser$;
  isDropdownOpen = false;

  constructor() {
    effect(() => {
      const currentCount = this.cartStore.totalItems();
      if (currentCount && currentCount > this.previousCount) {
        this.isCartBouncing = true;
        setTimeout(() => {
          this.isCartBouncing = false;
        }, 1000);
      }
      this.previousCount = currentCount;
    });
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  getUserDisplayName(user: User | null): string {
    return user?.displayName || user?.email?.split('@')[0] || 'User';
  }
  getUserPhotoUrl(user: User | null): string {
    return (
      user?.photoURL ||
      `https://ui-avatars.com/api/?name=${this.getUserDisplayName(user)}&background=random`
    );
  }
  async logout() {
    try {
      await this.auth.logout();
      this.isDropdownOpen = false;
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }
}
