import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CandidateModel } from '../../models/idm/candidate.model';
import { RecruiterModel } from '../../models/idm/recruiter.model';
import { OfferModel } from '../../models/offers/offer.model';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  private apiUrl = 'http://localhost:8081/api/dashboard/stats';
  private candidatesUrl = 'http://localhost:8081/api/candidates';
  private recruitersUrl = 'http://localhost:8081/api/recruiters';
  private offersUrl = 'http://localhost:8081/dashboard/admin/offers';
  private adminUrl = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getAllCandidates(): Observable<CandidateModel[]> {
    return this.http.get<CandidateModel[]>(this.candidatesUrl);
  }

  deleteCandidate(candidateId: string): Observable<string> {
    return this.http.delete(`${this.candidatesUrl}/${candidateId}`, { responseType: 'text' });
  }

  getAllRecruiters(): Observable<RecruiterModel[]> {
    return this.http.get<RecruiterModel[]>(this.recruitersUrl);
  }

  deleteRecruiter(recruiterId: string): Observable<string> {
    return this.http.delete(`${this.recruitersUrl}/${recruiterId}`, { responseType: 'text' });
  }

  getAllOffers(): Observable<{ message: string; data: OfferModel[] }> {
    return this.http.get<{ message: string; data: OfferModel[] }>(this.offersUrl);
  }

  getOfferById(offerId: string): Observable<{ message: string; data: OfferModel }> {
    return this.http.get<{ message: string; data: OfferModel }>(`${this.offersUrl}/${offerId}`);
  }

  deleteOffer(offerId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.offersUrl}/${offerId}`);
  }
  updateOwnAdmin(userData: { email: string; password?: string }): Observable<{ message: string; data: any }> {
    return this.http.put<{ message: string; data: any }>(`${this.adminUrl}/me`, userData);
  }
}
