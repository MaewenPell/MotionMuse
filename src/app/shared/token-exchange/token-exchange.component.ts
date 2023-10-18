import { Component, OnInit, inject } from '@angular/core';
import { ConnectionService } from '../services/connection.service';

@Component({
  selector: 'app-token-exchange',
  standalone: true,
  templateUrl: './token-exchange.component.html',
  styleUrls: ['./token-exchange.component.scss'],
})
export class TokenExchangeComponent implements OnInit {
  private connectionService = inject(ConnectionService);

  ngOnInit(): void {
    const url = new URL(window.location.href);

    const error = url.searchParams.get('error');
    const code = url.searchParams.get('code');

    if (code) {
      this.connectionService.authorizationCode = code;
    } else if (error) {
      this.connectionService.authorizationCode = 'denied';
    }
  }
}
