import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { User, UsersService } from '@hast/users';
import { MessageService } from 'primeng/api';
import { Observable, Subject } from 'rxjs';
import { concatMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'my-shop-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
// TODO: Route user here to query for stock
export class FeedbackComponent implements OnInit, OnDestroy {
  apiURLFeedback = environment.apiUrl + 'feedbacks';
  feedbackFormGroup: FormGroup;
  isSubmitted = false;
  types: { id: string; name: string }[] = [
    {
      id: 'bug',
      name: 'Bug'
    },
    {
      id: 'complaint',
      name: 'Complaint'
    },
    {
      id: 'compliment',
      name: 'Compliment'
    },
    {
      id: 'suggestion',
      name: 'Suggestion'
    },
    {
      id: 'other',
      name: 'Other'
    }
  ];

  private _unsubscribe$: Subject<void> = new Subject();

  get feedbackForm() {
    return this.feedbackFormGroup.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient, // This makes me sad because feedbackService is not in a library
    private messageService: MessageService,
    private router: Router,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this._initFeedbackForm();
  }

  submitFeedback() {
    this.isSubmitted = true;
    if (this.feedbackFormGroup.invalid) {
      return;
    }

    this._createFeedback()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((res) => {
        if (res) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Feedback Submitted!'
          });

          this.router.navigate(['/']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to submit Feedback!'
          });
        }
      });
  }

  private _initFeedbackForm() {
    this.feedbackFormGroup = this.formBuilder.group({
      type: ['', Validators.required],
      rating: [4, [Validators.required]],
      description: ['', Validators.required]
    });
  }

  private _createFeedback(): Observable<Feedback> {
    return this.usersService.observeCurrentUser().pipe(
      concatMap((user: User) => {
        if (user) {
          const feedback: Feedback = {
            type: this.feedbackForm.type.value,
            rating: this.feedbackForm.rating.value,
            description: this.feedbackForm.description.value,
            user: user.id,
            dateCreated: new Date()
          };

          return this.http.post<Feedback>(this.apiURLFeedback, feedback);
        }
      })
    );
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}

export class Feedback {
  id?: string;
  rating?: number;
  type?: string;
  description?: string;
  user?: any;
  dateCreated?: Date;
}
