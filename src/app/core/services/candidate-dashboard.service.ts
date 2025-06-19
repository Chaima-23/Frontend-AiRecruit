import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { OfferModel } from '../../models/offers/offer.model';
import { TestModel } from '../../models/test/test.model';


@Injectable({
  providedIn: 'root'
})
export class CandidateDashboardService {
  private apiUrl = 'http://localhost:8081/dashboard/candidate/offers';
  private ollamaApiUrl = 'http://localhost:8081/api/ollama';

  constructor(
    private http: HttpClient,
    ) {}





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

  getLatestTest(): Observable<{ message: string; data: TestModel }> {
    console.log('Attempting to fetch latest test...');
    return this.http.get<{ message: string; data: TestModel }>(`${this.ollamaApiUrl}/latest-test`).pipe(
      tap(response => console.log('Latest test fetched successfully:', response.data)),
      catchError(error => {
        console.error('Error fetching l atest test:', error);
        throw error;
      })
    );
  }


}
