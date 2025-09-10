// import { inject, Injectable } from '@angular/core';
// import { CanActivate, GuardResult, MaybeAsync, Router } from '@angular/router';
// import { Env } from 'src/env';
// import { ConnectionService } from '../shared/services/connection.service';
// import { StorageService } from '../shared/services/local-storage.service';
// import { Errors } from '../types/enums/errors.enums';

// @Injectable({
//   providedIn: 'root',
// })
// export class StravaAuthGuard implements CanActivate {
//   private onPremise = false;
//   connectionService = inject(ConnectionService);
//   storageService = inject(StorageService);
//   router = inject(Router);

//   public canActivate(): MaybeAsync<GuardResult> {
//     if (!this.onPremise) {
//       const connectionBase = this.storageService.get('connectionBase');

//       const env = new Env();

//       switch (connectionBase.errors) {
//         case Errors.NO_CONNECTION_BASE:
//           console.log('NO_CONNECTION_BASE');

//           // const redirectUri =
//           //   'http://localhost:4200/token-exchange?errorCode=noCb';
//           // const scope = 'read,profile:read_all,activity:read';
//           // const authorizeUrl = `https://www.strava.com/oauth/authorize?client_id=${env.client_id}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=${scope}`;

//           this.router.navigate(['/connection']);
//           return false;
//         case Errors.TOKEN_EXPIRED:
//           this.router.navigate(['/token-exchange'], {
//             queryParams: { errorCode: 'expired' },
//           });
//           return false;
//         default:
//           return true;
//       }
//     } else {
//       return true;
//     }
//   }
// }
