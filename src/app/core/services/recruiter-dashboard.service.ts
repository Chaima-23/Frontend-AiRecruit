import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FullTimeJobModel } from '../../models/offers/full-time-job.model';
import { PartTimeJobModel } from '../../models/offers/part-time-job.model';
import { InternshipOfferModel } from '../../models/offers/internship-offer.model';

@Injectable({
  providedIn: 'root'
})
export class RecruiterDashboardService {
  private apiUrl = 'http://localhost:8081/dashboard/recruiter/offers';

  constructor(private http: HttpClient) {}

  // Créer une offre full-time
  createFullTimeJob(fullTimeJob: FullTimeJobModel): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/job/fulltime`, fullTimeJob);
  }

  // Créer une offre part-time
  createPartTimeJob(partTimeJob: PartTimeJobModel): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/job/parttime`, partTimeJob);
  }

  // Créer une offre d'internship
  createInternshipOffer(internshipOffer: InternshipOfferModel): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/internship`, internshipOffer);
  }
}
