import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  effect,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { ConnectionComponent } from 'src/app/shared/components/connection/connection.component';
import { ConnectionService } from 'src/app/shared/services/connection.service';
import { DataComputationsService } from 'src/app/shared/services/data-computations.service';
import { StravaService } from 'src/app/shared/services/strava.service';
import { CardTypesEnum } from 'src/app/types/enums/cardTypes.enum';
import { MenuComponent } from '../../shared/components/menu/menu.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  standalone: true,
  imports: [
    SearchBarComponent,
    MenuComponent,
    CommonModule,
    ConnectionComponent,
    ToastModule,
    CardComponent,
    ButtonModule,
  ],
  providers: [MessageService],
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  private urlSubscription$!: Subscription;

  private activatedRoute = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  private cd = inject(ChangeDetectorRef);
  public connectionService = inject(ConnectionService);
  public dataComputationsService = inject(DataComputationsService);
  public stravaService = inject(StravaService);

  public cardTypesEnums = CardTypesEnum;

  protected weekActivities!: Subscription;

  private computeToasterEffect = effect(() => {
    this.displayToaster(this.connectionService.$isConnected());
  });

  ngOnInit() {
    // Subscribe to url changes
    // Triggered if we are redirected from Strava after authorization
    // TODO ? Create a separate route ?
    this.urlSubscription$ = this.activatedRoute.url.subscribe(() => {
      const url = new URL(window.location.href);

      if (url.search?.length > 0) {
        const authorizationCode = this.getCodeFromUrl(url);
        this.connectionService.getConnectionBaseFromStrava(authorizationCode);
      }
    });

    this.connectionService.manageConnectionTokens();
  }

  private displayToaster(status: boolean) {
    status
      ? this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Connexion via Strava réussie',
        })
      : this.messageService.add({
          severity: 'error',
          summary: 'Oops',
          detail: 'Connexion via Strava échouée',
        });
  }

  private getCodeFromUrl(url: URL) {
    let authorizationCode!: string;
    let error: string | null = null;
    let code: string | null = null;

    error = url.searchParams.get('error');
    code = url.searchParams.get('code');
    if (code) {
      authorizationCode = code;
    } else if (error) {
      authorizationCode = 'denied';
    }

    return authorizationCode;
  }

  ngOnDestroy(): void {
    this.urlSubscription$.unsubscribe();
  }
}
