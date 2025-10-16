import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConnectionService } from 'src/app/shared/services/connection.service';

@Component({
  selector: 'app-connection',
  imports: [ButtonModule, CommonModule],
  templateUrl: './connection.component.html',
  styleUrl: './connection.component.scss',
})
export class ConnectionComponent {
  public connectionService = inject(ConnectionService);
}
