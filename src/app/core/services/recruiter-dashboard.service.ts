import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FullTimeJobModel } from '../../models/offers/full-time-job.model';
import { PartTimeJobModel } from '../../models/offers/part-time-job.model';
import { InternshipOfferModel } from '../../models/offers/internship-offer.model';
import { AuthRedirectService } from './Auth-redirect.service';

@Injectable({
  providedIn: 'root'
})
export class RecruiterDashboardService {
  private apiUrl = 'http://localhost:8081/dashboard/recruiter/offers';

  constructor(
    private http: HttpClient,
    private authService: AuthRedirectService
  ) {}

  // Obtenir les en-têtes avec le token Keycloak
  private getHeaders(): HttpHeaders {
    const keycloak = this.authService['keycloak']; // Accès direct à l'instance Keycloak
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

  // Créer une offre full-time
  createFullTimeJob(fullTimeJob: FullTimeJobModel): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/job/fulltime`, fullTimeJob, {
      headers: this.getHeaders()
    });
  }

  // Créer une offre part-time
  createPartTimeJob(partTimeJob: PartTimeJobModel): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/job/parttime`, partTimeJob, {
      headers: this.getHeaders()
    });
  }

  // Créer une offre d'internship
  createInternshipOffer(internshipOffer: InternshipOfferModel): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/internship`, internshipOffer, {
      headers: this.getHeaders()
    });
  }
  // Obtenir toutes les offres du recruteur
  getMyOffers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-offers`, {
      headers: this.getHeaders()
    });
  }
  //supprimer une offre full-time, part-time ou internship

  deleteFullTimeJob(offerId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/job/fulltime/${offerId}`, {
      headers: this.getHeaders()
    });
  }

  deletePartTimeJob(offerId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/job/parttime/${offerId}`, {
      headers: this.getHeaders()
    });
  }

  deleteInternshipOffer(offerId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/internship/${offerId}`, {
      headers: this.getHeaders()
    });
  }
}
