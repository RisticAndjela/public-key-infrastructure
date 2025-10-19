import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class KeycloakService {
  private keycloak: Keycloak | null = null;

  init(): Promise<void> {
    this.keycloak = new Keycloak({
      url: environment.keycloakUrl,
      realm: environment.keycloakRealm,
      clientId: environment.keycloakClient,
    });

    return this.keycloak.init({
      onLoad: 'check-sso',
      checkLoginIframe: false,
    }).then(authenticated => {
      if (!authenticated) this.login();
    });
  }

  login(): void { this.keycloak?.login({ redirectUri: window.location.origin }); }
  logout(): void { this.keycloak?.logout({ redirectUri: window.location.origin }); }
  isLoggedIn(): boolean { return !!this.keycloak?.token; }
  getToken(): string | undefined { return this.keycloak?.token; }
  getRoles(): string[] {
    const token = this.keycloak?.token;
    if (!token) return [];
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.resource_access?.['pki-frontend']?.roles || [];
  }
}
