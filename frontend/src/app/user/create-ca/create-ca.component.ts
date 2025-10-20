import { Component } from '@angular/core';
import { CAUser } from '../model/ca.model';
import { UserService } from '../service/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrganizationService } from '../service/organization.service';
import { Organization } from '../model/organization.model';

@Component({
  selector: 'app-create-ca-user',
  templateUrl: './create-ca.component.html',
  styleUrls: ['../../../shared/themes/forms.css'],
  imports: [CommonModule,FormsModule]
})
export class CreateCAUserComponent {
  user: CAUser = {
    email: '',
    name: '',
    surname: '',
    organization: ''
  };

  organizations: Organization[] = [];
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService,private organizationService: OrganizationService) {
    organizationService.getAll().subscribe({
      next: (data) => {
        this.organizations = data;
      },
      error: (err) => {
        console.error('Error fetching organizations', err);
      }
    });
  }

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    this.userService.createCAUser(this.user).subscribe({
        next: () => {
          this.successMessage = 'CA user created successfully!';
          this.user = { email: '', name: '', surname: '', organization: '' };
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = err.error || 'Failed to create CA user.';
        }
      });
  }
}
