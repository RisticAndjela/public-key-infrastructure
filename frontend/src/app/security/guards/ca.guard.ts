import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class CAGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const hasSession = this.auth.isLoggedIn();
    if (!hasSession) {
      console.log('Access denied - Users must be logged in to access this page.');
    }
    const roles = this.auth.getRoles();
    if (roles.includes('ca_user')) {
      return true;
    } 
    return false;
  }
}
