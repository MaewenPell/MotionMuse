import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ConnectionService } from 'src/app/shared/services/connection.service';

@Injectable()
export class StravaInterceptor implements HttpInterceptor {
  private connectionService = inject(ConnectionService);

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (req.url.startsWith('https://www.strava.com/api/v3/')) {
      const token = this.connectionService.$stravaToken();

      const stravaReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });

      return next.handle(stravaReq);
    } else {
      return next.handle(req);
    }
  }
}
