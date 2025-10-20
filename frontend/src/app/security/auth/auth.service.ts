import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private keycloak: Keycloak | null = null;
  private initialized = false;

  init(): Promise<void> {
    this.keycloak = new Keycloak({
      url: environment.keycloakUrl,
      realm: environment.keycloakRealm,
      clientId: environment.keycloakClient,
    });

    const url = new URL(window.location.href);
    const isLogoutRedirect = url.searchParams.get('logout') === 'true';

    if (isLogoutRedirect || url.searchParams.has('code') || url.searchParams.has('state')) {
      url.searchParams.delete('logout');
      url.searchParams.delete('code');
      url.searchParams.delete('state');
      window.history.replaceState({}, document.title, url.pathname);
    }

    return this.keycloak
      .init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
      })
      .then(authenticated => {
        this.initialized = true;

        if (!authenticated && !isLogoutRedirect) {
          this.keycloak?.login({ redirectUri: window.location.origin + '/home' });
        }
      })
      .catch(err => {
        console.error('Keycloak init error:', err);
        this.initialized = true;
      });
  }

  login(): void {
    this.keycloak?.login({ redirectUri: window.location.origin + '/home' });
  }

  logout(): void {
    const logoutRedirect = new URL(window.location.origin);
    logoutRedirect.searchParams.set('logout', 'true');

    this.keycloak?.logout({ redirectUri: logoutRedirect.toString() });
  }

  getToken(): string | undefined {
    return this.keycloak?.token;
  }

  isLoggedIn(): boolean {
    return !!this.keycloak?.token;
  }

  getRoles(): string[] {
    const token = this.keycloak?.token;
    if (!token) return [];
    const payload = JSON.parse(atob(token.split('.')[1]));
    const realmRoles = payload.realm_access?.roles ?? [];
    const clientRoles = payload.resource_access?.[environment.keycloakClient]?.roles ?? [];
    return [...realmRoles, ...clientRoles];
  }

  isReady(): boolean {
    return this.initialized;
  }

  async updateTokenIfNeeded(minValiditySeconds = 30): Promise<string | null> {
    if (!this.keycloak) return null;
    try {
      await this.keycloak.updateToken(minValiditySeconds);
      return this.keycloak.token ?? null;
    } catch (err) {
      console.error('Failed to refresh Keycloak token', err);
      this.login();
      return null;
    }
  }

}
