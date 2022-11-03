import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Feedback } from './feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  apiURLFeedback = environment.apiUrl + 'feedbacks';

  constructor(private http: HttpClient) {}

  getAllFeedback(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(this.apiURLFeedback);
  }

  getFeedback(feedbackId: string): Observable<Feedback> {
    return this.http.get<Feedback>(`${this.apiURLFeedback}/${feedbackId}`);
  }

  createFeedback(feedback: Feedback): Observable<Feedback> {
    return this.http.post<Feedback>(this.apiURLFeedback, feedback);
  }

  // This is not needed
  // updateFeedback(feedback: Feedback): Observable<Feedback> {}

  deleteFeedback(feedbackId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURLFeedback}/${feedbackId}`);
  }

  getFeedbackCount(): Observable<number> {
    return this.http
      .get<number>(`${this.apiURLFeedback}/get/count`)
      .pipe(map((objectValue: any) => objectValue.orderCount));
  }
}
