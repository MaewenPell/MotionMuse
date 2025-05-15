import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import polyline from '@mapbox/polyline';
import { DateTime } from 'luxon';
import { SummaryActivity } from 'src/app/types/strava/types/summary-activity';
import { APP_COLORS } from 'src/styles/_colorVariables';
import { StravaService } from '../../services/strava.service';

@Component({
  selector: 'app-last-activity-card',
  imports: [CommonModule],
  templateUrl: './last-activity-card.component.html',
  styleUrl: './last-activity-card.component.scss',
})
export class LastActivityCardComponent {
  lastActivity = input.required<SummaryActivity>();

  private stravaService = inject(StravaService);

  public elapsedTimeFromSeconds = computed(() => {
    const elapsed_time = this.lastActivity().elapsed_time;

    return DateTime.fromSeconds(elapsed_time).toFormat("hh 'h' mm 'min'");
  });

  readonly traceCanvas =
    viewChild.required<ElementRef<HTMLCanvasElement>>('traceCanvas');

  readonly mapContainerRef =
    viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');

  constructor() {
    toObservable(this.lastActivity)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        if (this.lastActivity()?.id) {
          this.stravaService
            .getActivity(this.lastActivity().id)
            .subscribe(res => {
              const mapString = res.map.polyline;
              if (mapString) {
                const arr = polyline.decode(mapString);
                this.drawTrace(arr);
              }
            });
        }
      });
  }

  private drawTrace(coordinates: [number, number][]) {
    const canvas = this.traceCanvas().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Find bounds
    const [minLat, minLng] = coordinates.reduce(
      ([minLat, minLng], [lat, lng]) => [
        Math.min(minLat, lat),
        Math.min(minLng, lng),
      ],
      [Infinity, Infinity]
    );
    const [maxLat, maxLng] = coordinates.reduce(
      ([maxLat, maxLng], [lat, lng]) => [
        Math.max(maxLat, lat),
        Math.max(maxLng, lng),
      ],
      [-Infinity, -Infinity]
    );

    // Calculate scale maintaining aspect ratio
    const width = maxLng - minLng;
    const height = maxLat - minLat;
    const scale = Math.min(canvas.width / width, canvas.height / height);

    // Calculate centering offsets
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;
    const offsetX = (canvas.width - scaledWidth) / 2;
    const offsetY = (canvas.height - scaledHeight) / 2;

    // Draw path
    ctx.beginPath();
    coordinates.forEach(([lat, lng], index) => {
      const x = (lng - minLng) * scale + offsetX;
      const y = canvas.height - (lat - minLat) * scale - offsetY;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.strokeStyle = APP_COLORS.WHITE;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}
