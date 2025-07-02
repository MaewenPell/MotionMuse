import {
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Stepper, StepperModule } from 'primeng/stepper';
import { take } from 'rxjs';
import { RegisterFormComponent } from 'src/app/shared/components/register-form/register-form.component';
import {
  ConnectionService,
  FinalizePaylod,
} from 'src/app/shared/services/connection.service';
import { ConnectionBase } from 'src/app/types/access-token';
import { Env } from 'src/env';

export type ConnectionOptions = 'connect' | 'register';

@Component({
  selector: 'app-connection',
  imports: [
    StepperModule,
    ButtonModule,
    RegisterFormComponent,
    FormsModule,
    DialogModule,
    SelectButtonModule,
  ],
  templateUrl: './connection.component.html',
  styleUrl: './connection.component.scss',
})
export class ConnectionComponent {
  //#region DI
  private activatedRoute = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  connectionService = inject(ConnectionService);

  //#endregion

  //#region Signal
  connectionBase = signal<ConnectionBase | null>(null);
  isUserLogged = signal(false);
  payload = signal<FinalizePaylod>({
    username: '',
    password: '',
    expiresIn: 0,
    expiresAt: 0,
    token: '',
    refreshToken: '',
  });

  areCredentialsSet = computed(() => {
    return (
      !!this.appRegisterRef()?.credentials().username &&
      !!this.appRegisterRef()?.credentials().password
    );
  });
  //#endregion

  //#region ViewChild
  public iframeRef = viewChild<ElementRef<HTMLIFrameElement>>('iframeRef');

  //#region Props
  showStravaDialog = false;

  stateOptions: Array<{ label: string; value: ConnectionOptions }> = [
    { label: 'Connection', value: 'connect' },
    { label: 'Register', value: 'register' },
  ];

  switchValue: ConnectionOptions = 'connect';
  //#endregion

  //#region ViewChild
  appRegisterRef = viewChild<RegisterFormComponent>('appRegisterForm');
  stepperRef = viewChild<Stepper>('stepper');
  //#endregion

  constructor() {
    this.activatedRoute.url.subscribe(res => {
      console.log('Route changed', res);

      const url = new URL(window.location.href);
      const searchParams = new URLSearchParams(url.search).get('errorCode');

      if (searchParams === 'no-code') {
        const authCode = this.getCodeFromUrl(url);
        this.switchValue = 'register';

        this.connectionService
          .getConnectionBaseFromStrava(authCode)
          .pipe(take(1))
          .subscribe((connectionBase: ConnectionBase) => {
            this.connectionBase.set(connectionBase);
          });
      }
    });
  }

  private ttot = toObservable(this.connectionBase)
    .pipe(takeUntilDestroyed())
    .subscribe(cb => {
      if (cb) {
        console.log(cb);

        this.payload.set({
          username: this.appRegisterRef()?.credentials().username ?? '',
          password: this.appRegisterRef()?.credentials().password ?? '',
          expiresIn: this.connectionBase()?.expires_in ?? 0,
          expiresAt: this.connectionBase()?.expires_at ?? 0,
          token: this.connectionBase()?.access_token ?? '',
          refreshToken: this.connectionBase()?.refresh_token ?? '',
        });
      }
    });

  public getStravaAuthUrl() {
    const env = new Env();
    const redirectUri = 'http://localhost:4200/connection?errorCode=no-code';
    const scope = 'read,profile:read_all,activity:read';

    const finalUrl = `https://www.strava.com/oauth/authorize?client_id=${env.client_id}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=${scope}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(finalUrl);
  }

  register() {
    if (this.switchValue === 'register') {
      const user = this.connectionService
        .register(this.appRegisterRef()?.credentials())
        .subscribe(res => {
          console.log(res);
          if (res) {
            this.isUserLogged.set(true);
            this.stepperRef()?.updateValue(2);
          }
        });
    } else {
      // const user = this.connectionService.login();
    }
  }

  public finalizeAccount() {
    this.connectionService.finalize(this.payload()).subscribe(res => {
      console.log(res);
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

  public loadChange(event: Event) {
    console.log(event);
  }
}
