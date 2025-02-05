import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { DateTime } from 'luxon';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { ChartsComponent } from 'src/app/shared/components/charts/charts.component';
import { ConnectionComponent } from 'src/app/shared/components/connection/connection.component';
import { CardService } from 'src/app/shared/services/card.service';
import { ConnectionService } from 'src/app/shared/services/connection.service';
import { DataComputationsService } from 'src/app/shared/services/data-computations.service';
import { StravaService } from 'src/app/shared/services/strava.service';
import { CardTypesEnum } from 'src/app/types/enums/cardTypes.enum';
import { SummaryActivity } from 'src/app/types/strava/types/summary-activity';
import { MenuComponent } from '../../shared/components/menu/menu.component';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  standalone: true,
  imports: [
    MenuComponent,
    CommonModule,
    ConnectionComponent,
    ToastModule,
    CardComponent,
    ButtonModule,
    ChartsComponent,
  ],
  providers: [MessageService, StravaService],
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  private urlSubscription$!: Subscription;

  private activatedRoute = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  private destoyRef = inject(DestroyRef);
  private router = inject(Router);
  public connectionService = inject(ConnectionService);
  public dataComputationsService = inject(DataComputationsService);
  public stravaService = inject(StravaService);
  public cardService = inject(CardService);

  public cardTypesEnums = CardTypesEnum;

  public rawActivities: SummaryActivity[] = [];
  public yearRawActivites: SummaryActivity[] = [];

  private _ = toObservable(this.connectionService.$isConnected).subscribe(
    () => {
      const after = DateTime.now().startOf('week').minus({ week: 1 });
      const before = DateTime.now().endOf('week');

      const allYear = DateTime.now().startOf('year');
      const allYearBefore = DateTime.now().endOf('year');

      this.displayToaster(true);

      this.stravaService
        .getActivities(before, after)
        .pipe(takeUntilDestroyed(this.destoyRef))
        .subscribe(res => {
          this.rawActivities = res;
        });

      this.stravaService
        .getActivities(allYearBefore, allYear)
        .pipe(takeUntilDestroyed(this.destoyRef))
        .subscribe(res => {
          this.yearRawActivites = res;
        });
    }
  );

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
