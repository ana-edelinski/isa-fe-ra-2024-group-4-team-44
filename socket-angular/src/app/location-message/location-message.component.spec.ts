import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationMessageComponent } from './location-message.component';

describe('LocationMessageComponent', () => {
  let component: LocationMessageComponent;
  let fixture: ComponentFixture<LocationMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
