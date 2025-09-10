import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ConnectionBase } from 'src/app/types/access-token';
import { StravaAPIUtils } from 'src/app/types/strava-api-token';
import { Env } from 'src/env';

export type Credentials = {
  username: string;
  password: string;
};

type ConnectedUser = {
  username: string;
  token: string;
  refreshToken: string;
};

export type FinalizePaylod = {
  username: string;
  password: string;
  expiresIn: number;
  expiresAt: number;
  token: string;
  refreshToken: string;
};

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  private http = inject(HttpClient);
  private env = new Env();

  public getConnectionBaseFromStrava(authorizationCode: string) {
    const params = new HttpParams()
      .set('client_id', this.env.client_id)
      .set('client_secret', this.env.client_secret)
      .set('code', authorizationCode)
      .set('grant_type', StravaAPIUtils.AUTH);

    return this.http.post<ConnectionBase>(StravaAPIUtils.TOKEN_URL, null, {
      params: params,
    });
  }

  register(credentials: Credentials | undefined) {
    return this.http.post<{ username: string }>(
      'http://localhost:5073/api/user/register',
      credentials
    );
  }

  login(credentials: Credentials) {
    return this.http.post<ConnectedUser>(
      'http://localhost:5073/api/user/login',
      {
        username: credentials.username,
        password: credentials.password,
      }
    );
  }

  finalize(finalizeObject: FinalizePaylod) {
    return this.http.post(
      'http://localhost:5073/api/user/finalize',
      finalizeObject
    );
  }
}
