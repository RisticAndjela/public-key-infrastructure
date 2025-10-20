import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class EEGuard implements CanActivate {
  constructor(private auth: AuthService) {}

  canActivate(): boolean {
    const hasSession = this.auth.isLoggedIn();
    if (!hasSession) {
      this.auth.login();
      return false;
    }
    const roles = this.auth.getRoles();
    if (roles.includes('ee_user')) {
      return true;
    } 
    return false;
  }

}
