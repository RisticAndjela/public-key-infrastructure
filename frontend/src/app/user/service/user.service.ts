import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {CreateCAUserRequest} from '../dto/CreateCAUserRequest';
import {environment} from '../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.serverUrl}/users`;

  createCAUser(dto: CreateCAUserRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create-ca`, dto);
  }
}