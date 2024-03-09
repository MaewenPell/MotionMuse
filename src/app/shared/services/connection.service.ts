import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { env } from 'env';
import { take } from 'rxjs';
import { ConnectionBase } from 'src/app/types/access-token';
import { Errors } from 'src/app/types/enums/errors.enums';
import { StravaAPIUtils } from 'src/app/types/strava-api-token';
import { DataComputationsService } from './data-computations.service';
import { StorageService } from './local-storage.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  private http = inject(HttpClient);
  private utilsService = inject(UtilsService);
  private storageService = inject(StorageService);
  private dataComputationService = inject(DataComputationsService);

  public $isConnected = signal(false);
  public $stravaToken: WritableSignal<string | undefined> = signal(undefined);

  private _clientId!: string;
  private _clientSecret!: string;

  get clientId() {
    return env.client_id;
  }

  get clientSecret() {
    return env.client_secret;
  }

  authorizeApp() {
    const stravaUrl = 'https://www.strava.com/oauth/authorize';

    const responseType = 'code';
    const redirectUri = 'http://localhost:4200/token-exchange';
    const scope = 'read,profile:read_all,activity:read';

    const authorizeUrl = `${stravaUrl}?client_id=${this.clientId}&response_type=${responseType}&redirect_uri=${redirectUri}&approval_prompt=force&scope=${scope}`;

    // Redirect to /token-exchange page
    window.location.href = authorizeUrl;
  }

  public manageConnectionTokens() {
    const connectionBase = this.storageService.get('connectionBase');

    switch (connectionBase.errors) {
      case Errors.NO_CONNECTION_BASE:
        console.log('NO_CONNECTION_BASE');
        this.authorizeApp();
        break;
      case Errors.TOKEN_EXPIRED:
        console.log('TOKEN EXPIRED');
        this.getTokenFromRefreshToken();
        break;
      default:
        console.log('OK retirieving connection base from local storage');
        this.$stravaToken.set(connectionBase.connectionbase?.access_token);
        this.$isConnected.set(true);
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
      .pipe(take(1))
      .subscribe((connectionBase: ConnectionBase) => {
        this.storageService.set(
          'connectionBase',
          JSON.stringify(connectionBase)
        );
      });
  }

  public getTokenFromConnectionBase(): string | undefined {
    this.manageConnectionTokens();

    return this.storageService.get('connectionBase').connectionbase
      ?.access_token;
  }

  public getTokenFromRefreshToken() {
    const currentConnectionBase =
      this.storageService.get('connectionBase').connectionbase;
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

        console.log('Token refreshed');
      });
  }
}
