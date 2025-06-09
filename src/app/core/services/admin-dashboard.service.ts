import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CandidateModel} from '../../models/idm/candidate.model';
import { RecruiterModel } from '../../models/idm/recruiter.model';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  private apiUrl = 'http://localhost:8081/api/dashboard/stats';
  private candidatesUrl = 'http://localhost:8081/api/candidates';
  private recruitersUrl = 'http://localhost:8081/api/recruiters';
  private offersUrl = 'http://localhost:8081/dashboard/admin/offers';

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  getAllCandidates(): Observable<CandidateModel[]> {
    return this.http.get<CandidateModel[]>(`${this.candidatesUrl}`);
  }

  deleteCandidate(candidateId: string): Observable<string> {
    return this.http.delete(`${this.candidatesUrl}/${candidateId}`, { responseType: 'text' });
  }

  getAllRecruiters(): Observable<RecruiterModel[]> {
    return this.http.get<RecruiterModel[]>(`${this.recruitersUrl}`);
  }

  deleteRecruiter(recruiterId: string): Observable<string> {
    return this.http.delete(`${this.recruitersUrl}/${recruiterId}`, { responseType: 'text' });
  }
  getAllOffers(): Observable<any> {
    return this.http.get<any>(this.offersUrl);
  }

  getOfferById(offerId: string): Observable<any> {
    return this.http.get<any>(`${this.offersUrl}/${offerId}`);
  }

  deleteOffer(offerId: string): Observable<any> {
    return this.http.delete<any>(`${this.offersUrl}/${offerId}`);
  }
}
