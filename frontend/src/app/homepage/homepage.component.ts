import { Component, OnInit } from '@angular/core';
import { KeycloakService } from '../security/keycloak/keycloak.service';

@Component({
  selector: 'app-home',
  template: '<p>Homepage works!</p>',
  standalone: true
})
export class HomepageComponent implements OnInit {
  constructor(private keycloak: KeycloakService) {}

  async ngOnInit() {
    await this.keycloak.init();

    if (!this.keycloak.isLoggedIn()) {
      console.log('User not logged in, redirecting...');
    }
  }
}
