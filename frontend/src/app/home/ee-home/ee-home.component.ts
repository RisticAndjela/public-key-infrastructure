import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AllCertificationsComponent } from "../../certificate/all-certificates/all-certificates.component";

@Component({
  selector: 'app-ee-home',
  templateUrl: './ee-home.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, AllCertificationsComponent],
  styleUrls: ['../../shared/themes/page.css','../../shared/themes/tabs.css','../../shared/themes/table.css','../../shared/themes/form.css']
})
export class EeHomeComponent  {
  constructor() {}

}
