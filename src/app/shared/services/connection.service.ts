import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { env } from 'env';
import { AccessAthleteToken } from 'src/app/types/accessToken';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  private http = inject(HttpClient);

  private _clientId!: string;
  private _clientSecret!: string;

  get clientId() {
    return env.client_id;
  }

  get clientSecret() {
    return env.client_secret;
  }

  public authorizationCode: string | null | 'denied' = null;

  public authorizeApp() {
    const stravaUrl = 'https://www.strava.com/oauth/authorize';

    const responseType = 'code';
    const redirectUri = 'http://localhost:4200/token-exchange';
    const scope = 'activity:read_all';

    const authorizeUrl = `${stravaUrl}?client_id=${this._clientId}&response_type=${responseType}&redirect_uri=${redirectUri}&approval_prompt=force&scope=${scope}`;

    window.location.href = authorizeUrl;
  }

  accessAthleteToken(authorizationCode: string) {
    const url = 'https://www.strava.com/oauth/token';

    const params = new HttpParams()
      .set('client_id', this._clientId)
      .set('client_secret', this._clientSecret)
      .set('code', authorizationCode)
      .set('grant_type', 'authorization_code');

    this.http
      .post<AccessAthleteToken>(url, null, { params: params })
      .subscribe(athleteToken => {
        console.log(athleteToken);
      });
  }
}
