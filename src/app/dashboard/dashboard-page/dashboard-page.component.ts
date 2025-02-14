import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { ChartsComponent } from 'src/app/shared/components/charts/charts.component';
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
    // ConnectionComponent,
    ToastModule,
    CardComponent,
    ButtonModule,
    ChartsComponent,
  ],
  providers: [MessageService, StravaService],
})
export class DashboardPageComponent {
  public connectionService = inject(ConnectionService);
  public dataComputationsService = inject(DataComputationsService);
  public stravaService = inject(StravaService);
  public cardService = inject(CardService);

  public cardTypesEnums = CardTypesEnum;

  public rawActivities: SummaryActivity[] = [];
  public yearRawActivites: SummaryActivity[] = [];
}
