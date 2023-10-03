import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputSearchComponent } from '../input-search/input-search.component';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, InputSearchComponent],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  @Input({ required: true }) pageTitle!: string;
}
