// import {
//   HttpEvent,
//   HttpHandler,
//   HttpInterceptor,
//   HttpRequest,
// } from '@angular/common/http';
// import { Injectable, inject } from '@angular/core';
// import { AuthService } from "@auth0/auth0-angular";
// import { Observable } from 'rxjs';
// import { StorageService } from 'src/app/shared/services/local-storage.service';

import { HttpClient, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

// @Injectable()
// export class StravaInterceptor implements HttpInterceptor {
//   private authenticationService = inject(AuthService)

//   intercept(
//     req: HttpRequest<unknown>,
//     next: HttpHandler
//   ): Observable<HttpEvent<unknown>> {
//     if (req.url.startsWith('https://www.strava.com/api/v3/')) {
//       const token = this.authenticationService.user$.

//       const stravaReq = req.clone({
//         headers: req.headers.set('Authorization', `Bearer ${token}`),
//       });

//       return next.handle(stravaReq);
//     } else {
//       return next.handle(req);
//     }
//   }
// }

export function StravaInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  if (req.url.startsWith('https://www.strava.com/api/v3/')) {
    const authService = inject(AuthService);
    const http = inject(HttpClient);

    // Use getAccessTokenSilently() to get the actual access token
    authService.user$.subscribe(user => {
      const stravaAccessToken =
        user?.['https://dev-motion-muse.eu.auth0.com/strava_access_token'];

      if (stravaAccessToken) {
        http
          .get('https://www.strava.com/api/v3/athlete', {
            headers: {
              Authorization: `Bearer ${stravaAccessToken}`,
            },
          })
          .subscribe(data => {
            console.log('Strava athlete profile', data);
          });
      }
    });
  }

  return next(req);
}
