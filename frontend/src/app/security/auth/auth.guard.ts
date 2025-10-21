import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private keycloak: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.keycloak.isLoggedIn()) {
      this.keycloak.login();
      return false;
    }

    const requiredRoles = route.data['roles'] as string[] | undefined;
    if (requiredRoles && !requiredRoles.some(role => this.keycloak.getRoles().includes(role))) {
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}
