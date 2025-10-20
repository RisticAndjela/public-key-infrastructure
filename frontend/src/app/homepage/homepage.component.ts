import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../security/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './homepage.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class HomepageComponent {
  initialized = false;

  constructor(public auth: AuthService) {
    this.initialized = auth.isLoggedIn();
    console.log('Auth initialized status in HomepageComponent:', this.initialized);
    const roles = this.auth.getRoles();
    if (roles.includes('admin_user')) {
      console.log('User is an admin');
    } else if (roles.includes('ca_user')) {
      console.log('User is a CA user');
    } else if (roles.includes('ee_user')) {
      console.log('User is a EE user');
    } else {
      console.log('User has no specific roles');
      if (!this.auth.isLoggedIn()) {
        console.log('User is not logged in, redirecting to login');
        this.auth.login();
        return;
      }
    }
    };
    
}
