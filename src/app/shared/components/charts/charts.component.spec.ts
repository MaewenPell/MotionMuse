import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsComponent } from './charts.component';
import { NGX_ECHARTS_CONFIG } from 'ngx-echarts';

describe('ChartsComponent', () => {
  let component: ChartsComponent;
  let fixture: ComponentFixture<ChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartsComponent],
      providers: [
        {
          provide: NGX_ECHARTS_CONFIG,
          useFactory: () => ({ echarts: () => import('echarts') }),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
