import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {
  SelectButtonChangeEvent,
  SelectButtonModule,
} from 'primeng/selectbutton';
import { StepperModule } from 'primeng/stepper';
import { RegisterFormComponent } from 'src/app/shared/components/register-form/register-form.component';
import { ConnectionService } from 'src/app/shared/services/connection.service';

export type ConnectionOptions = 'login' | 'register';

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
  private router = inject(Router);
  connectionService = inject(ConnectionService);

  //#endregion

  //#region Signal
  isUserLogged = signal(false);
  currentEndRoute = signal<'login' | 'register'>('login');

  areCredentialsSet = computed(() => {
    return (
      !!this.appRegisterRef()?.credentials().username &&
      !!this.appRegisterRef()?.credentials().password
    );
  });
  //#endregion

  //#region Props
  stateOptions: Array<{ label: string; value: ConnectionOptions }> = [
    { label: 'Login', value: 'login' },
    { label: 'Register', value: 'register' },
  ];

  switchValue: ConnectionOptions = 'login';
  //#endregion

  //#region ViewChild
  appRegisterRef = viewChild<RegisterFormComponent>('appRegisterForm');
  //#endregion

  changeNavigation(event: SelectButtonChangeEvent) {
    this.router
      .navigate([event.value], { relativeTo: this.activatedRoute })
      .then(onFullFilled => {
        if (onFullFilled) {
          switch (this.activatedRoute.firstChild?.snapshot.url.at(-1)?.toString()) {
            case 'login':
              this.currentEndRoute.set('login');
              return;
            case 'register':
              this.currentEndRoute.set('register');
              return;
          }
        }
      });
  }
}
