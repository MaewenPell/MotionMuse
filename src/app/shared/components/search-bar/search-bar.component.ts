import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputSearchComponent } from '../input-search/input-search.component';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, InputSearchComponent, ButtonModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  @Input({ required: true }) pageTitle!: string;
}
