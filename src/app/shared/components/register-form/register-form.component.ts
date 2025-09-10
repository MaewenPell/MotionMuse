import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { take } from 'rxjs';
import { ConnectionBase } from 'src/app/types/access-token';
import { Env } from 'src/env';
import {
  ConnectionService,
  FinalizePaylod,
} from '../../services/connection.service';
import { StorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-register-form',
  imports: [
    PasswordModule,
    FormsModule,
    InputTextModule,
    IftaLabelModule,
    ButtonModule,
    DialogModule,
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
})
export class RegisterFormComponent {
  private activatedRoute = inject(ActivatedRoute);
  private connectionService = inject(ConnectionService);
  private destroyedRef = inject(DestroyRef);
  private localStorageService = inject(StorageService);

  public kind = input<'login' | 'register'>('login');

  public credentials = computed(() => {
    return {
      username: this.username(),
      password: this.password(),
    };
  });

  public stravaToken = signal('');
  protected username = signal('');
  protected password = signal('');

  connectionBase = signal<ConnectionBase | null>(null);
  private payload = signal<FinalizePaylod>({
    username: '',
    password: '',
    expiresIn: 0,
    expiresAt: 0,
    token: '',
    refreshToken: '',
  });

  constructor() {
    this.activatedRoute.url.subscribe(res => {
      const url = new URL(decodeURIComponent(window.location.href));
      const authCode = this.getCodeFromUrl(url);

      this.refillForm();

      this.connectionService
        .getConnectionBaseFromStrava(authCode)
        .pipe(take(1))
        .subscribe((connectionBase: ConnectionBase) => {
          this.connectionBase.set(connectionBase);
        });
    });

    toObservable(this.connectionBase)
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe(cb => {
        if (cb) {
          this.localStorageService.set('access_token', cb.access_token);
          this.stravaToken.set(
            this.localStorageService.getItem('access_token') ?? ''
          );

          this.payload.set({
            username: this.username(),
            password: this.password(),
            expiresIn: cb.expires_in,
            expiresAt: cb.expires_at,
            token: cb.access_token,
            refreshToken: cb.refresh_token,
          });

          this.connectionService
            .register(this.payload())
            .pipe(takeUntilDestroyed(this.destroyedRef))
            .subscribe(res => {
              console.log('res => ', res);
            });
        }
      });
  }

  public registerWithStrava() {
    const env = new Env();
    const baseUrl = 'http://localhost:4200/connection/register';
    const redirectUri = `${baseUrl}&errorCode=no-code`;

    const scope = 'read,profile:read_all,activity:read';

    const finalUrl = `https://www.strava.com/oauth/authorize?client_id=${env.client_id}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=${scope}`;

    this.localStorageService.set('username', this.username());
    this.localStorageService.set('password', this.password());

    window.location.href = finalUrl;
  }

  login() {
    this.connectionService
      .login({
        username: this.username() ?? '',
        password: this.password() ?? '',
      })
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe(res => {
        console.log('res');
      });
  }

  private refillForm() {
    this.username.set(this.localStorageService.getItem('username') ?? '');
    this.password.set(this.localStorageService.getItem('password') ?? '');
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
