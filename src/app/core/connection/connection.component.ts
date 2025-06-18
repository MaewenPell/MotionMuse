import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { IconComponent } from 'src/app/shared/components/icon/icon.component';
import { RegisterFormComponent } from 'src/app/shared/components/register-form/register-form.component';
import { toIconPipe } from 'src/app/shared/pipes/to-icon.pipe';
import { ConnectionService } from 'src/app/shared/services/connection.service';
import { ConnectionBase } from 'src/app/types/access-token';
import { Env } from 'src/env';

@Component({
  selector: 'app-connection',
  imports: [
    StepperModule,
    ButtonModule,
    IconComponent,
    toIconPipe,
    RegisterFormComponent,
  ],
  templateUrl: './connection.component.html',
  styleUrl: './connection.component.scss',
})
export class ConnectionComponent {
  private activatedRoute = inject(ActivatedRoute);
  connectionService = inject(ConnectionService);

  connectionBase = signal<ConnectionBase | null>(null);
  isUserLogged = signal(false);

  appRegisterRef = viewChild<RegisterFormComponent>('appRegisterForm');

  areCredentialsSet = computed(() => {
    return (
      !!this.appRegisterRef()?.credentials().username &&
      !!this.appRegisterRef()?.credentials().password
    );
  });

  constructor() {
    this.activatedRoute.url.subscribe(res => {
      console.log('Route changed', res);

      const url = new URL(window.location.href);
      const searchParams = new URLSearchParams(url.search).get('errorCode');

      if (searchParams === 'no-code') {
        const authCode = this.getCodeFromUrl(url);

        // this.connectionService
        //   .getConnectionBaseFromStrava(authCode)
        //   .pipe(take(1))
        //   .subscribe((connectionBase: ConnectionBase) => {
        //     console.log(connectionBase);
        //     // this.connectionBase.set(connectionBase);
        //   });

        this.connectionBase.set({
          id: 1,
          token_type: 'Bearer',
          expires_at: 1749161819,
          expires_in: 19728,
          refresh_token: '0fe2e790c70e44a31e2301c241acd4aadd980516',
          access_token: '547c25c4406426c6f0553a384dda6f0409f1d70c',
          athlete: {
            id: 17464740,
            username: 'maewen_pelletier',
            resource_state: 2,
            firstname: 'Maewen',
            lastname: 'Pelletier',
            bio: 'Mountain pack - [Trail Running 🏃 | Climbing 🧗‍♂️| Alpinism 🗻 | Skiing 🎿]',
            city: 'Annecy',
            state: '',
            country: null,
            sex: 'M',
            premium: true,
            summit: true,
            created_at: '2016-09-10T20:17:37Z',
            updated_at: '2025-02-12T17:49:45Z',
            badge_type_id: 1,
            weight: 58,
            profile_medium:
              'https://dgalywyr863hv.cloudfront.net/pictures/athletes/17464740/25892616/3/medium.jpg',
            profile:
              'https://dgalywyr863hv.cloudfront.net/pictures/athletes/17464740/25892616/3/large.jpg',
            friend: null,
            follower: null,
          },
        });
      }
    });
  }

  navigateToStrava() {
    const env = new Env();
    const redirectUri = 'http://localhost:4200/connection?errorCode=no-code';
    const scope = 'read,profile:read_all,activity:read';
    const authorizeUrl = `https://www.strava.com/oauth/authorize?client_id=${env.client_id}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=${scope}`;

    window.location.href = authorizeUrl;
  }

  register() {
    const user = this.connectionService
      .register(this.appRegisterRef()?.credentials())
      .subscribe(res => {
        console.log(res);
        if (res) {
          this.isUserLogged.set(true);
        }
      });
  }

  private getCodeFromUrl(url: URL) {
    let authorizationCode!: string;
    let code: string | null = null;

    code = url.searchParams.get('code');
    if (code) {
      authorizationCode = code;
    }

    return authorizationCode;
  }
}
