import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { APP_COLORS } from 'src/styles/_colorVariables';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  @Input({ required: true }) icon!: PrimeIcons | string;
  @Input({ required: true }) isPrimeNgIcon!: boolean;

  @Input() iconColor: APP_COLORS = APP_COLORS.WHITE;
  @Input() iconSizeInPx: number = 24;
  @Input() backgroundVisible: boolean = true;
}
