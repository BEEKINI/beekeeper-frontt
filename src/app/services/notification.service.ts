import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  Observable,
  BehaviorSubject,
  interval,
  switchMap,
  Subscription,
} from 'rxjs';
import { TokenService } from '../services/token.service';
import { BASE_URL } from '../consts/consts';

export interface NotificationModel {
  id: number;
  user_id: number;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  protected static readonly URL = `${BASE_URL}/notifications`;

  protected notifications$ = new BehaviorSubject<NotificationModel[]>([]);
  protected subscription!: Subscription;

  protected readonly http = inject(HttpClient);
  protected readonly tokenService = inject(TokenService);

  public get notifications(): Observable<NotificationModel[]> {
    return this.notifications$.asObservable();
  }

  public fetchNotifications(): Observable<NotificationModel[]> {
    return this.http.get<NotificationModel[]>(NotificationService.URL, {
      headers: this.tokenService.getHeadersForRequest(),
    });
  }

  public startPolling(): void {
    if (this.subscription) {
      this.stopPolling();
    }

    this.subscription = interval(5000)
      .pipe(switchMap(() => this.fetchNotifications()))
      .subscribe((notifications) => {
        this.notifications$.next(notifications);
      });
  }

  public stopPolling(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public deleteNotification(notifId: number): Observable<void> {
    return this.http.delete<void>(`${NotificationService.URL}/${notifId}`, {
      headers: this.tokenService.getHeadersForRequest(),
    });
  }
}
