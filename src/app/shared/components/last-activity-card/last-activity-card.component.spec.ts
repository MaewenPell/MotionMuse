import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastActivityCardComponent } from './last-activity-card.component';

describe('LastActivityCardComponent', () => {
  let component: LastActivityCardComponent;
  let fixture: ComponentFixture<LastActivityCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastActivityCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastActivityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
