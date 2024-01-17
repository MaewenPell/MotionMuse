import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-connection',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss'],
})
export class ConnectionComponent {
  public connectionService = inject(ConnectionService);
}
