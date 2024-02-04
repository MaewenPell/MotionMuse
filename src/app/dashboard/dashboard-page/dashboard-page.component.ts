import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { DateTime } from 'luxon';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { ConnectionComponent } from 'src/app/shared/components/connection/connection.component';
import { ConnectionService } from 'src/app/shared/services/connection.service';
import { StravaService } from 'src/app/shared/services/strava.service';
import { CardDataType } from 'src/app/types/card-data.type';
import { APP_COLORS } from 'src/styles/_colorVariables';
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
  private _isConnected!: boolean;
  private urlSubscription$!: Subscription;
  private isConnectedSub$!: Subscription;
  private destroyRef = inject(DestroyRef);

  private activatedRoute = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  public connectionService = inject(ConnectionService);
  public stravaService = inject(StravaService);

  public set isConnected(isConnected: boolean) {
    this._isConnected = isConnected;
  }

  public get isConnected() {
    return this._isConnected;
  }

  public cardValues: CardDataType[] = [
    {
      type: 'resume',
      color: APP_COLORS.ORANGE,
      title: 'Weekly Distance',
      value: 54,
      unit: 'Km',
      evolutionType: 'up',
      evolutionValue: 5,
      evolutionSentence: 'Since Last Week',
    },
    {
      type: 'evolution',
      color: APP_COLORS.YELLOW,
      title: 'Daily Steps',
      value: 10000,
      unit: 'Steps',
      evolutionType: 'down',
      evolutionValue: 200,
      evolutionSentence: 'Since Yesterday',
    },
    {
      type: 'resume',
      color: APP_COLORS.LIGHT_BLUE,
      title: 'Calories Burned',
      value: 500,
      unit: 'Kcal',
      evolutionType: 'equal',
      evolutionValue: 0,
      evolutionSentence: 'No Change',
    },
    {
      type: 'evolution',
      color: APP_COLORS.LIGHT_RED,
      title: 'Heart Rate',
      value: 72,
      unit: 'BPM',
      evolutionType: 'up',
      evolutionValue: 3,
      evolutionSentence: 'Since Last Measurement',
    },
    {
      type: 'resume',
      color: APP_COLORS.GREEN,
      title: 'Sleep Duration',
      value: 8,
      unit: 'Hours',
      evolutionType: 'down',
      evolutionValue: 1,
      evolutionSentence: 'Since Last Night',
    },
    {
      type: 'evolution',
      color: APP_COLORS.MAIN_VIOLET,
      title: 'Water Intake',
      value: 2,
      unit: 'L',
      evolutionType: 'up',
      evolutionValue: 0.5,
      evolutionSentence: 'Since Yesterday',
    },
  ];

  protected weekActivities!: Subscription;

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

    this.isConnectedSub$ = this.connectionService.isConnected$.subscribe(
      (isConnected: boolean) => {
        this.isConnected = isConnected;

        this.displayToaster(isConnected);
      }
    );

    this.connectionService.manageConnectionTokens();
  }

  public getStravaActivities() {
    const after = DateTime.now().startOf('week');
    const before = DateTime.now().endOf('week');
    this.weekActivities = this.stravaService
      .getActivities(before, after)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(activities => {
        console.log(activities);
      });
  }

  private displayToaster(isConnected: boolean) {
    isConnected
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
    this.isConnectedSub$.unsubscribe();
    this.urlSubscription$.unsubscribe();
  }
}
