import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const hasSession = this.auth.isLoggedIn();
    if (!hasSession) {
      this.auth.login();
      return false;
    }
    const roles = this.auth.getRoles();
    if (roles.includes('admin_user')) {
      return true;
    } 
    return false;
  }
}
