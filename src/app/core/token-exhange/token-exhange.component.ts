import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Env } from 'env';
import { take } from 'rxjs';
import { ConnectionService } from 'src/app/shared/services/connection.service';
import { StorageService } from 'src/app/shared/services/local-storage.service';
import { ConnectionBase } from 'src/app/types/access-token';
import { StravaAPIUtils } from 'src/app/types/strava-api-token';

@Component({
  selector: 'app-token-exhange',
  imports: [],
  template: '',
  styles: '',
})
export class TokenExhangeComponent {
  private activatedRoute = inject(ActivatedRoute);
  private connectionService = inject(ConnectionService);
  private storageService = inject(StorageService);
  private router = inject(Router);
  private httpClient = inject(HttpClient);

  private env = new Env();

  constructor() {
    this.activatedRoute.url.subscribe(() => {
      const url = new URL(window.location.href);

      if (url.search?.length > 0) {
        const searchParams = new URLSearchParams(url.search).get('errorCode');

        if (searchParams && searchParams === 'noCb') {
          const authorizationCode = this.getCodeFromUrl(url);
          this.connectionService.getConnectionBaseFromStrava(authorizationCode);

          const params = new HttpParams()
            .set('client_id', this.env.client_id)
            .set('client_secret', this.env.client_secret)
            .set('code', authorizationCode)
            .set('grant_type', StravaAPIUtils.AUTH);

          this.httpClient
            .post<ConnectionBase>(StravaAPIUtils.TOKEN_URL, null, {
              params: params,
            })
            .pipe(take(1))
            .subscribe((connectionBase: ConnectionBase) => {
              this.storageService.set(
                'connectionBase',
                JSON.stringify(connectionBase)
              );
            });
        } else if (searchParams && searchParams === 'expired') {
          const currentConnectionBase =
            this.storageService.get('connectionBase').connectionbase;
          const currentRefreshToken = (currentConnectionBase as ConnectionBase)
            .refresh_token;
          const params = new HttpParams()
            .set('client_id', this.env.client_id)
            .set('client_secret', this.env.client_secret)
            .set('grant_type', StravaAPIUtils.REFRESH)
            .set('refresh_token', currentRefreshToken);

          this.httpClient
            .post(StravaAPIUtils.TOKEN_URL, null, {
              params: params,
            })
            .subscribe(
              (connectionBaseWithoutAthlete: Partial<ConnectionBase>) => {
                // Todo verfier que ça fonctionne
                const newConnectionBase = {
                  ...(currentConnectionBase as ConnectionBase),
                  ...connectionBaseWithoutAthlete,
                };
                this.storageService.set(
                  'connectionBase',
                  JSON.stringify(newConnectionBase)
                );

                console.log('Token refreshed');
              }
            );
        }

        this.router.navigate(['/dashboard']);
      }
    });
  }

  private getCodeFromUrl(url: URL) {
    let authorizationCode!: string;
    let code: string | null = null;

    code = url.searchParams.get('code');
    if (code) {
      authorizationCode = code;
    } else {
      this.router.navigate(['/dashboard']);
    }

    return authorizationCode;
  }
}
