import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AccessGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const hasSession = this.auth.isLoggedIn();

    if (!hasSession) {
      this.auth.login();
      return false;
    }

    return true;
  }
}
