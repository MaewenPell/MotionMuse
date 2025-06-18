import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ConnectionBase } from 'src/app/types/access-token';
import { StravaAPIUtils } from 'src/app/types/strava-api-token';
import { Env } from 'src/env';
import { StorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);
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

  register(credentials: { username: string; password: string } | undefined) {
    return this.http.post('http://localhost:5073/api/user/register', credentials);
  }
}
