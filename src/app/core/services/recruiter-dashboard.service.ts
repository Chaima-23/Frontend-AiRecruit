import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; // Import HttpParams
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
  private applicationUrl = 'http://localhost:8081/dashboard/recruiter/applications';

  constructor(
    private http: HttpClient,
    private authService: AuthRedirectService
  ) {}

  // Obtenir les en-têtes avec le token Keycloak
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

  getApplications(offerId?: string): Observable<any> {
    let params = new HttpParams();
    if (offerId) {
      params = params.set('offerId', offerId);
      console.log('Fetching applications with params:', { offerId });
    } else {
      console.log('Fetching all applications with no params');
    }
    return this.http.get<any>(`${this.applicationUrl}`, { headers: this.getHeaders(), params });
  }

  // Obtenir les détails d'un candidat
  getCandidateDetails(candidateId: string): Observable<any> {
    console.log('Fetching candidate details for ID:', candidateId);
    return this.http.get<any>(`${this.applicationUrl}/candidate/${candidateId}`, { headers: this.getHeaders() });
  }

  // Obtenir les candidatures favorites
  getFavoriteApplications(): Observable<any> {
    console.log('Fetching favorite applications...');
    return this.http.get<any>(`${this.applicationUrl}/favorites`, { headers: this.getHeaders() });
  }

  // Ajouter une candidature aux favoris
  addApplicationToFavorites(applicationId: string): Observable<any> {
    console.log('Adding application to favorites, ID:', applicationId);
    return this.http.post<any>(`${this.applicationUrl}/${applicationId}/favorite`, {}, { headers: this.getHeaders() });
  }

  // Retirer une candidature des favoris
  removeApplicationFromFavorites(applicationId: string): Observable<any> {
    console.log('Removing application from favorites, ID:', applicationId);
    return this.http.delete<any>(`${this.applicationUrl}/${applicationId}/favorite`, { headers: this.getHeaders() });
  }

  // Créer une offre full-time
  createFullTimeJob(fullTimeJob: FullTimeJobModel): Observable<any> {
    console.log('Creating full-time job:', fullTimeJob);
    return this.http.post<any>(`${this.apiUrl}/job/fulltime`, fullTimeJob, {
      headers: this.getHeaders()
    });
  }

  // Créer une offre part-time
  createPartTimeJob(partTimeJob: PartTimeJobModel): Observable<any> {
    console.log('Creating part-time job:', partTimeJob);
    return this.http.post<any>(`${this.apiUrl}/job/parttime`, partTimeJob, {
      headers: this.getHeaders()
    });
  }

  // Créer une offre d'internship
  createInternshipOffer(internshipOffer: InternshipOfferModel): Observable<any> {
    console.log('Creating internship offer:', internshipOffer);
    return this.http.post<any>(`${this.apiUrl}/internship`, internshipOffer, {
      headers: this.getHeaders()
    });
  }

  // Obtenir toutes les offres du recruteur
  getMyOffers(): Observable<any> {
    console.log('Fetching my offers...');
    return this.http.get<any>(`${this.apiUrl}/my-offers`, {
      headers: this.getHeaders()
    });
  }

  // Supprimer une offre full-time
  deleteFullTimeJob(offerId: string): Observable<any> {
    console.log('Deleting full-time job, ID:', offerId);
    return this.http.delete<any>(`${this.apiUrl}/job/fulltime/${offerId}`, {
      headers: this.getHeaders()
    });
  }

  // Supprimer une offre part-time
  deletePartTimeJob(offerId: string): Observable<any> {
    console.log('Deleting part-time job, ID:', offerId);
    return this.http.delete<any>(`${this.apiUrl}/job/parttime/${offerId}`, {
      headers: this.getHeaders()
    });
  }

  // Supprimer une offre internship
  deleteInternshipOffer(offerId: string): Observable<any> {
    console.log('Deleting internship offer, ID:', offerId);
    return this.http.delete<any>(`${this.apiUrl}/internship/${offerId}`, {
      headers: this.getHeaders()
    });
  }

  // Mettre à jour une offre full-time
  updateFullTimeJob(offerId: string, fullTimeJob: FullTimeJobModel): Observable<any> {
    console.log('Updating full-time job, ID:', offerId, 'Data:', fullTimeJob);
    return this.http.put<any>(`${this.apiUrl}/job/fulltime/${offerId}`, fullTimeJob, {
      headers: this.getHeaders()
    });
  }

  // Mettre à jour une offre part-time
  updatePartTimeJob(offerId: string, partTimeJob: PartTimeJobModel): Observable<any> {
    console.log('Updating part-time job, ID:', offerId, 'Data:', partTimeJob);
    return this.http.put<any>(`${this.apiUrl}/job/parttime/${offerId}`, partTimeJob, {
      headers: this.getHeaders()
    });
  }

  // Mettre à jour une offre internship
  updateInternshipOffer(offerId: string, internshipOffer: InternshipOfferModel): Observable<any> {
    console.log('Updating internship offer, ID:', offerId, 'Data:', internshipOffer);
    return this.http.put<any>(`${this.apiUrl}/internship/${offerId}`, internshipOffer, {
      headers: this.getHeaders()
    });
  }
}
