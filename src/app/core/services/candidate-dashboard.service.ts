// candidate-dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OfferModel } from '../../models/offers/offer.model';
import { JobOfferModel } from '../../models/offers/job-offer.model';
import { FullTimeJobModel } from '../../models/offers/full-time-job.model';
import { InternshipOfferModel } from '../../models/offers/internship-offer.model';
import { PartTimeJobModel } from '../../models/offers/part-time-job.model';

@Injectable({
  providedIn: 'root'
})
export class CandidateDashboardService {
  private apiUrl = 'http://localhost:8081/dashboard/candidate/offers';
  private flaskApiUrl = 'http://localhost:5000/extract-text';

  constructor(private http: HttpClient) {}

  getAllOffers(): Observable<{ message: string; data: OfferModel[] }> {
    console.log('Attempting to fetch all offers from backend...');
    return this.http.get<{ message: string; data: OfferModel[] }>(`${this.apiUrl}`).pipe(
      tap(response => console.log('All offers fetched successfully:', response.data)),
      catchError(error => {
        console.error('Error fetching all offers from backend:', error);
        throw error;
      })
    );
  }

  getOfferById(id: string): Observable<{ message: string; data: OfferModel }> {
    console.log('Attempting to fetch offer by ID:', id);
    return this.http.get<{ message: string; data: OfferModel }>(`${this.apiUrl}/${id}`).pipe(
      tap(response => console.log('Offer fetched successfully by ID:', response.data)),
      catchError(error => {
        console.error('Error fetching offer by ID:', id, error);
        throw error;
      })
    );
  }
}

// Import these operators if not already imported
import { tap, catchError } from 'rxjs/operators';
