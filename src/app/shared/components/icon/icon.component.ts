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
  @Input() backgroundColor!: APP_COLORS;
  @Input() color: string = APP_COLORS.WHITE;
  @Input() backgroundVisible: boolean = true;
  @Input() widthInPx: number = 48;
  @Input() heightInPx: number = 48;
}
