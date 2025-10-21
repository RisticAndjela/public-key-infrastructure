import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AllCertificationsComponent } from '../../certificate/all-certificates/all-certificates.component';
import { CreateCertificationComponent } from '../../certificate/create-certificate/create-certificate.component';
import { RegisterCAComponent } from "../../user/register-ca/register-ca.component";

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['../../shared/themes/page.css','../../shared/themes/tabs.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, AllCertificationsComponent, CreateCertificationComponent, RegisterCAComponent],
})
export class AdminHomeComponent {
  activeTab: string = 'addUser';
  constructor() {}
}
