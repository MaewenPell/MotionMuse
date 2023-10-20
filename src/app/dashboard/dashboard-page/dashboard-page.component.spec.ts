import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MenuComponent } from 'src/app/shared/menu/menu.component';
import { SearchBarComponent } from 'src/app/shared/search-bar/search-bar.component';
import { DashboardPageComponent } from './dashboard-page.component';

describe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SearchBarComponent,
        DashboardPageComponent,
        MenuComponent,
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
    });
    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
