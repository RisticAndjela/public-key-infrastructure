import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../security/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  imports:[CommonModule,FormsModule],
  standalone: true,
})
export class NavbarComponent {
  constructor(private auth: AuthService) {}

  logout() {
    this.auth.logout();
  }
}
