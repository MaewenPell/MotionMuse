import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/shared/services/local-storage.service';

@Injectable()
export class StravaInterceptor implements HttpInterceptor {
  private storageService = inject(StorageService);

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (req.url.startsWith('https://www.strava.com/api/v3/')) {
      const token = this.storageService.get('connectionBase').connectionbase?.access_token;

      const stravaReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });

      return next.handle(stravaReq);
    } else {
      return next.handle(req);
    }
  }
}
