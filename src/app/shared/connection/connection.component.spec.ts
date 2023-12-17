import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { ConnectionComponent } from './connection.component';

describe('ConnectionComponent', () => {
  let component: ConnectionComponent;
  let fixture: ComponentFixture<ConnectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConnectionComponent, HttpClientTestingModule],
      providers: [MessageService],
    });
    fixture = TestBed.createComponent(ConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
