import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecruiterService {
  private apiUrl = 'http://localhost:8081/api/recruiters';

  constructor(private http: HttpClient) {}

  registerRecruiter(recruiterData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, recruiterData);
  }
}
