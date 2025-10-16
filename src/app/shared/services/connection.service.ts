import { HttpClient } from '@angular/common/http';
import { DOCUMENT, Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '@auth0/auth0-angular';

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
  private auth = inject(AuthService);
  private doc = inject(DOCUMENT);

  isAuthenticated$ = toSignal(this.auth.isAuthenticated$);

  handleLogin() {
    this.auth.loginWithRedirect({
      appState: {
        target: '/dashboard',
      },
    });
  }

  handleSignUp() {
    this.auth.loginWithRedirect({
      // appState: {
      //   target: '/token-exchange',
      // },
      authorizationParams: {
        screen_hint: 'signup',
      },
    });
  }

  handleLogout() {
    this.auth.logout({
      logoutParams: {
        returnTo: this.doc.location.origin,
      },
    });
  }
}
