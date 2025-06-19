import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OffersPublicListService {
  private apiUrl = 'http://localhost:8081/offers'; // Adjust URL as needed

  constructor(private http: HttpClient) {}

  getPublicOffers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
