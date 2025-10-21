import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AllCertificationsComponent } from '../../certificate/all-certificates/all-certificates.component';

@Component({
  selector: 'app-ca-home',
  templateUrl: './ca-home.component.html',
  styleUrls: ['../../shared/themes/page.css','../../shared/themes/tabs.css','../../shared/themes/table.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, AllCertificationsComponent],
})
export class CaHomeComponent {

}
