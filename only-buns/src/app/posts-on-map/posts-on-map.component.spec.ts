import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsOnMapComponent } from './posts-on-map.component';

describe('PostsOnMapComponent', () => {
  let component: PostsOnMapComponent;
  let fixture: ComponentFixture<PostsOnMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsOnMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostsOnMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
