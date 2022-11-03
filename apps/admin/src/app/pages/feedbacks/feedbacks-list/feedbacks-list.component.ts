import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Feedback } from '../feedback';
import { FeedbackService } from '../feedback.service';

@Component({
  selector: 'admin-feedbacks-list',
  templateUrl: './feedbacks-list.component.html',
  styleUrls: ['./feedbacks-list.component.scss']
})
export class FeedbacksListComponent implements OnInit, OnDestroy {
  feedback: Feedback[] = [];

  private _endsubs$: Subject<void> = new Subject();

  constructor(
    private confirmationService: ConfirmationService,
    private feedbackService: FeedbackService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this._getFeedback();
  }

  deleteFeedback(feedbackId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to Delete this Feedback?',
      header: 'Delete Feedback',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.feedbackService
          .deleteFeedback(feedbackId)
          .pipe(takeUntil(this._endsubs$))
          .subscribe(
            () => {
              this._getFeedback();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Feedback is deleted!'
              });
            },
            () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Feedback is not deleted!'
              });
            }
          );
      }
    });
  }

  private _getFeedback() {
    this.feedbackService
      .getAllFeedback()
      .pipe(takeUntil(this._endsubs$))
      .subscribe((feedback) => {
        this.feedback = feedback;
      });
  }

  ngOnDestroy() {
    this._endsubs$.next();
    this._endsubs$.complete();
  }
}
