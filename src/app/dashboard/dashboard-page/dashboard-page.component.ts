import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { ConnectionComponent } from 'src/app/shared/connection/connection.component';
import { ConnectionService } from 'src/app/shared/services/connection.service';
import { MenuComponent } from '../../shared/menu/menu.component';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';

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
  ],
  providers: [MessageService],
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  private _isConnected!: boolean;
  private urlSubscription$!: Subscription;
  private isConnectedSub$!: Subscription;
  private activatedRoute = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  public connectionService = inject(ConnectionService);

  public set isConnected(isConnected: boolean) {
    this._isConnected = isConnected;
  }

  public get isConnected() {
    return this._isConnected;
  }

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
