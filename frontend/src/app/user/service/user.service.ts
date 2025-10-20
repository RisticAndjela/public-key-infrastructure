import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CAUser } from '../model/ca.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.baseUrl}/users`;

  createCAUser(dto: CAUser): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create-ca`, dto);
  }
}