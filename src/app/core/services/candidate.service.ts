import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private apiUrl = 'http://localhost:8081/api/candidates';

  constructor(private http: HttpClient) {}

  registerCandidate(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, payload, {
      responseType: 'text' as 'json'
    });
  }}
