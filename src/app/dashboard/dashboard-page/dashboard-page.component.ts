import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  ],
})
export class DashboardPageComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public connectionService = inject(ConnectionService);

  public isConnected = false;

  ngOnInit(): void {
    this.activatedRoute.url.subscribe(() => {
      const url = new URL(window.location.href);
      this.getCodeFromUrl(url);
    });
  }

  private getCodeFromUrl(url: URL) {
    let error: string | null = null;
    let code: string | null = null;

    error = url.searchParams.get('error');
    code = url.searchParams.get('code');
    if (code) {
      this.connectionService.authorizationCode = code;
    } else if (error) {
      this.connectionService.authorizationCode = 'denied';
    }
  }
}
