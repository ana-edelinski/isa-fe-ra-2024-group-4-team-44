import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectUsersDialogComponent } from './select-users-dialog.component';

describe('SelectUsersDialogComponent', () => {
  let component: SelectUsersDialogComponent;
  let fixture: ComponentFixture<SelectUsersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectUsersDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectUsersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
