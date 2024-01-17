import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardDataType } from 'src/app/types/card-data.type';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input({ required: true }) cardValues!: CardDataType;
}
