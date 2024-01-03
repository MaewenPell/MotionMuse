import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { env } from 'env';
import { DateTime } from 'luxon';
import { Subject } from 'rxjs';
import { ConnectionBase } from 'src/app/types/access-token';
import { Errors } from 'src/app/types/enums/errors.enums';
import { StravaAPIUtils } from 'src/app/types/strava-api-token';
import { StorageService } from './local-storage.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  private http = inject(HttpClient);
  private utilsService = inject(UtilsService);
  private storageService = inject(StorageService);

  private _clientId!: string;
  private _clientSecret!: string;

  get clientId() {
    return env.client_id;
  }

  get clientSecret() {
    return env.client_secret;
  }

  public isConnected$ = new Subject<boolean>();

  authorizeApp() {
    const stravaUrl = 'https://www.strava.com/oauth/authorize';

    const responseType = 'code';
    const redirectUri = 'http://localhost:4200/token-exchange';
    const scope = 'activity:read_all';

    const authorizeUrl = `${stravaUrl}?client_id=${this.clientId}&response_type=${responseType}&redirect_uri=${redirectUri}&approval_prompt=force&scope=${scope}`;

    // Redirect to /token-exchange page
    window.location.href = authorizeUrl;
  }

  public manageConnectionTokens() {
    const connectionBase = this.storageService.get('connectionBase');

    switch (connectionBase) {
      case Errors.NO_CONNECTION_BASE:
        this.authorizeApp();
        break;
      case Errors.TOKEN_EXPIRED:
        this.getTokenFromRefreshToken();
        break;
      case connectionBase as ConnectionBase:
        this.isConnected$.next(true);
        break;
    }
  }

  public getConnectionBaseFromStrava(authorizationCode: string) {
    const params = new HttpParams()
      .set('client_id', this.clientId)
      .set('client_secret', this.clientSecret)
      .set('code', authorizationCode)
      .set('grant_type', StravaAPIUtils.AUTH);

    this.http
      .post<ConnectionBase>(StravaAPIUtils.TOKEN_URL, null, { params: params })
      .subscribe((connectionBase: ConnectionBase) => {
        this.storageService.set(
          'connectionBase',
          JSON.stringify(connectionBase)
        );
        this.isConnected$.next(true);
      });
  }

  public getTokenFromRefreshToken() {
    const currentConnectionBase = this.storageService.get('connectionBase');
    const currentRefreshToken = (currentConnectionBase as ConnectionBase)
      .refresh_token;
    const params = new HttpParams()
      .set('client_id', this.clientId)
      .set('client_secret', this.clientSecret)
      .set('grant_type', StravaAPIUtils.REFRESH)
      .set('refresh_token', currentRefreshToken);

    this.http
      .post(StravaAPIUtils.TOKEN_URL, null, {
        params: params,
      })
      .subscribe((connectionBaseWithoutAthlete: Partial<ConnectionBase>) => {
        // Todo verfier que ça fonnctionne
        const newConnectionBase = {
          ...(currentConnectionBase as ConnectionBase),
          ...connectionBaseWithoutAthlete,
        };
        this.storageService.set(
          'connectionBase',
          JSON.stringify(newConnectionBase)
        );

        this.isConnected$.next(true);
      });
  }

  isTokenStillAvailable(expirationDateInMs: number): boolean {
    const now = DateTime.now();
    const expirationDatetime = DateTime.fromMillis(expirationDateInMs);

    return expirationDatetime.diff(now).minutes > 0;
  }
}
