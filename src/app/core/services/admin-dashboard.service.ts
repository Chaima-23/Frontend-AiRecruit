import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CandidateModel } from '../../models/idm/candidate.model';
import { RecruiterModel } from '../../models/idm/recruiter.model';
import { AuthRedirectService } from './Auth-redirect.service';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  private apiUrl = 'http://localhost:8081/api/dashboard/stats';
  private candidatesUrl = 'http://localhost:8081/api/candidates';
  private recruitersUrl = 'http://localhost:8081/api/recruiters';
  private adminUrl = 'http://localhost:8081/api/users';
  private offersUrl = 'http://localhost:8081/dashboard/admin/offers'; // New endpoint for offers

  constructor(
    private http: HttpClient,
    private authService: AuthRedirectService
  ) {}

  // Get headers with Keycloak token
  private getHeaders(): HttpHeaders {
    const keycloak = this.authService['keycloak'];
    const token = keycloak?.token;
    if (!token) {
      console.error('No Keycloak token available');
      throw new Error('Utilisateur non authentifié');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  // Admin dashboard methods
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() });
  }

  getAllCandidates(): Observable<CandidateModel[]> {
    return this.http.get<CandidateModel[]>(this.candidatesUrl, { headers: this.getHeaders() });
  }

  deleteCandidate(candidateId: string): Observable<string> {
    return this.http.delete(`${this.candidatesUrl}/${candidateId}`, { headers: this.getHeaders(), responseType: 'text' });
  }

  getAllRecruiters(): Observable<RecruiterModel[]> {
    return this.http.get<RecruiterModel[]>(this.recruitersUrl, { headers: this.getHeaders() });
  }

  deleteRecruiter(recruiterId: string): Observable<string> {
    return this.http.delete(`${this.recruitersUrl}/${recruiterId}`, { headers: this.getHeaders(), responseType: 'text' });
  }

  updateOwnAdmin(userData: { email: string; password?: string }): Observable<{ message: string; data: any }> {
    return this.http.put<{ message: string; data: any }>(`${this.adminUrl}/me`, userData, { headers: this.getHeaders() });
  }

  // Get all offers for admin dashboard
  getAllOffers(): Observable<{ message: string; data: any[] }> {
    return this.http.get<{ message: string; data: any[] }>(this.offersUrl, { headers: this.getHeaders() });
  }

  getOfferById(offerId: string): Observable<{ message: string; data: any }> {
    return this.http.get<{ message: string; data: any }>(`${this.offersUrl}/${offerId}`, { headers: this.getHeaders() });
  }

  deleteOffer(offerId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.offersUrl}/${offerId}`, { headers: this.getHeaders() });
  }
}
