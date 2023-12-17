import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { env } from 'env';
import { environment } from 'environment.dev';
import { Observable, Subject, map } from 'rxjs';
import { ConnectionBase } from 'src/app/types/accessToken';
import { APIResponse } from 'src/app/types/api-response';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  private http = inject(HttpClient);
  private utilsService = inject(UtilsService);

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

    window.location.href = authorizeUrl;
  }

  getAccessAthleteToken(authorizationCode: string) {
    const url = 'https://www.strava.com/oauth/token';

    const params = new HttpParams()
      .set('client_id', this.clientId)
      .set('client_secret', this.clientSecret)
      .set('code', authorizationCode)
      .set('grant_type', 'authorization_code');

    this.http
      .post<ConnectionBase>(url, null, { params: params })
      .subscribe((connectionBase: ConnectionBase) => {
        connectionBase.id = connectionBase.athlete.id;
        connectionBase.athlete.connectionBaseId = connectionBase.id;
        this.createConnection(connectionBase).subscribe(response => {
          this.isConnected$.next(true);
        });
      });
  }

  getConnections(): Observable<APIResponse<ConnectionBase[]>> {
    const url = `${environment.baseUrl}/connections`;

    return this.http.get<APIResponse<ConnectionBase[]>>(url).pipe(
      map(response => {
        return response;
      })
    );
  }

  createConnection(connectionBase: ConnectionBase) {
    const url = `${environment.baseUrl}/connection/${connectionBase.athlete.id}`;

    return this.http.post<APIResponse<ConnectionBase>>(url, connectionBase);
  }
}
