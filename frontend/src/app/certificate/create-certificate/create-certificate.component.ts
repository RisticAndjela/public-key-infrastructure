import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormsModule, NgForm } from '@angular/forms';
import {
  CertificateType,
  CreateCertificateDto,
  SimpleCertificate,
  KEYSTOREDOWNLOADFORMAT,
} from '../model/certificate.model';
import { DialogComponent } from "../../shared/dialog/dialog.component";
import { CertificateService } from '../service/certificate.service';
import { Organization } from '../model/organization.model';
import { OrganizationService } from '../service/organziation.service';
import {
  EXTENDED_KEY_USAGES,
  KEY_USAGES,
  SUPPORATED_EXTENSIONS_OIDS,
  SUPPORTED_EXTENSIONS
} from '../model/certificate-extensions.constants';

@Component({
  selector: 'app-create-certification',
  templateUrl: './create-certificate.component.html',
  styleUrls: ['../../shared/themes/form.css'],
  imports: [FormsModule, CommonModule, DialogComponent],
  standalone: true,
})
export class CreateCertificationComponent implements OnInit {
  @Input() role: 'admin' | null = null;

  showDialog: boolean = false;
  dialogMessage: string = '';

  dialogType: 'info' | 'error' | 'confirm' | 'download' = 'error';
  issuerValidFrom: Date | null = null;
  issuerValidTo: Date | null = null;
  cnErrorMessage: string | null = null;
  sanErrorMessage: string | null = null;

  certificateForm: CreateCertificateDto = {
    type: null,
    commonName: '',
    surname: '',
    givenName: '',
    organization: '',
    organizationalUnit: '',
    country: '',
    email: '',
    startDate: null,
    endDate: null,
    extensions: {},
    issuerCertificateId: '',
    assignToOrganizationName: null
  };

  supportedExtensions = SUPPORTED_EXTENSIONS

  // source-of-truth store + object mirror for stable binding
  extensionEntries: Map<string, string> = new Map<string, string>();
  extensionEntriesObject: { [key: string]: string } = {}; // used in [(ngModel)] for inputs

  // explicit order array so we preserve insertion order and avoid keyvalue sorting issues
  extensionOrder: string[] = [];
  keyUsageOptions = KEY_USAGES;
  extendedKeyUsageOptions = EXTENDED_KEY_USAGES

  availableCertificates: SimpleCertificate[] = [];
  allOrganizations: Organization[] = [];

  constructor(private certificateService: CertificateService, private organizationService:OrganizationService) {}

  ngOnInit() {
    this.certificateService.getApplicableCA().subscribe(cers => {
      this.availableCertificates = cers;
    });
    if (this.role === 'admin') {
      this.organizationService.getAll().subscribe(orgs => {
        this.allOrganizations = orgs;
      })
    }
  }

  private setMapEntryAndMirror(key: string, value: string, appendIfMissing = true) {
    const exists = this.extensionEntries.has(key);
    this.extensionEntries.set(key, value);
    this.extensionEntriesObject[key] = value;
    if (!exists && appendIfMissing) this.extensionOrder.push(key);
  }

  private deleteMapEntryAndMirror(key: string) {
    this.extensionEntries.delete(key);
    delete this.extensionEntriesObject[key];
    const idx = this.extensionOrder.indexOf(key);
    if (idx >= 0) this.extensionOrder.splice(idx, 1);
  }

  onIssuerChange(issuerId: string) {
    const issuer = this.availableCertificates.find(c => c.id === issuerId);
    if (issuer) {
      this.issuerValidFrom = issuer.startDate;
      this.issuerValidTo = issuer.endDate;
    }
  }

  addExtension() {
    const availableKey = this.supportedExtensions.find(k => !this.extensionEntries.has(k));
    if (!availableKey) return;
    this.setMapEntryAndMirror(availableKey, '');
  }

  removeExtension(key: string) {this.deleteMapEntryAndMirror(key); }
  isKeyDisabled(key: string, currentKey: string): boolean {return this.extensionEntries.has(key) && key !== currentKey;}

  onExtensionKeyChange(index: number, newKey: string) {
    const oldKey = this.extensionOrder[index];
    if (oldKey === newKey) return;
    if (this.extensionEntries.has(newKey)) return;

    const val = this.extensionEntries.get(oldKey) ?? '';

    this.extensionEntries.delete(oldKey);
    delete this.extensionEntriesObject[oldKey];

    this.extensionOrder[index] = newKey;
    this.extensionEntries.set(newKey, val);
    this.extensionEntriesObject[newKey] = val;
  }

  setExtensionValue(key: string, value: string) {
    this.extensionEntries.set(key, value);
    this.extensionEntriesObject[key] = value;
  }

  /* -------------------- small helpers / form submit -------------------- */

  customRequired(control: AbstractControl, message: string) {
    return control.value ? null : { required: message };
  }

  submitCertificate(form: NgForm) {
    Object.keys(this.extensionEntriesObject).forEach(k => this.extensionEntries.set(k, this.extensionEntriesObject[k]));
    this.certificateForm.extensions = {};
    this.extensionEntries.forEach((value, key) => {
      this.certificateForm.extensions[SUPPORATED_EXTENSIONS_OIDS[key]] = value;
    });

    form.form.markAllAsTouched();
    if (!form.valid) {
      this.dialogMessage = 'Please fill all required fields correctly.';
      this.dialogType = 'error';
      this.showDialog = true;
      return;
    }
    
    this.certificateService.createCertificate(this.certificateForm).subscribe({
      next: () => {
        this.showDialogInfo('Certificate created successfully.');
      },
      error: err => {
        console.error('Failed to create certificate:', err);
        this.showDialogError('Failed to create certificate. Please try again.');
      }
    });
    
  }

  showDialogError(message: string) {
    this.dialogMessage = message;
    this.dialogType = 'error';
    this.showDialog = true;
  }

  showDialogInfo(message: string) {
    this.dialogMessage = message;
    this.dialogType = 'info';
    this.showDialog = true;
  }

  showDialogDownload() {
    this.dialogMessage = "Please download the certificate and private key now. You won't be able to access the private key again.";
    this.dialogType = 'download';
    this.showDialog = true;
  }

  onDialogClose() {
    this.showDialog = false;
  }

  protected readonly Object = Object;

  onDialogConfirm(data?: {extension?: string, alias?: string, password?: string, reason?: string}) {
    this.showDialog = false;
  }

  trackByExtensionKey(index: number, key: string) {
    return key;
  }

  toggleCheckbox(key: string, option: string) {
    const currentValue = this.extensionEntries.get(key) || '';
    let values = currentValue.split(',').map(v => v.trim()).filter(v => v.length);

    if (values.includes(option)) {
      values = values.filter(v => v !== option);
    } else {
      values.push(option);
    }
    this.setMapEntryAndMirror(key, values.join(','));
  }

// helper for checkboxes: check if option is selected
  isChecked(key: string, option: string): boolean {
    const currentValue = this.extensionEntries.get(key) || '';
    const values = currentValue.split(',').map(v => v.trim());
    return values.includes(option);
  }

}
