import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingPageComponent } from './training-page.component';

describe('TrainingPageComponent', () => {
  let component: TrainingPageComponent;
  let fixture: ComponentFixture<TrainingPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TrainingPageComponent]
    });
    fixture = TestBed.createComponent(TrainingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
