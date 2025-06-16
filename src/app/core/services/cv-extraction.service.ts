import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CvExtractionService {
  private flaskApiUrl = 'http://localhost:5000/extract-text';

  constructor(private http: HttpClient) {}

  extractTextFromPdf(file: File): Observable<{ text: string, spring_response: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ text: string, spring_response: string }>(this.flaskApiUrl, formData);
  }
}
