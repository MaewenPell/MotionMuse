import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenExhangeComponent } from './token-exhange.component';

describe('TokenExhangeComponent', () => {
  let component: TokenExhangeComponent;
  let fixture: ComponentFixture<TokenExhangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenExhangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TokenExhangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
