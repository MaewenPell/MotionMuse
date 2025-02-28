import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { take } from 'rxjs';
import { ConnectionBase } from 'src/app/types/access-token';
import { StravaAPIUtils } from 'src/app/types/strava-api-token';
import { StorageService } from './local-storage.service';
import { Env } from "src/env";

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
}
