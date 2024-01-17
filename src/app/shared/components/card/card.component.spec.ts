import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;

    component.cardValues = {
      type: 'resume',
      color: '#FF0000',
      title: 'Mock Title',
      value: 'Mock Value',
      iconRef: 'Mock Icon Reference',
      arrowType: 'up',
      evolutionValue: 'Mock Evolution Value',
      evolutionSentece: 'Mock Evolution Sentence',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
