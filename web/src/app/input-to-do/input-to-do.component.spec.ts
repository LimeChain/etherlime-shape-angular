import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputToDoComponent } from './input-to-do.component';

describe('InputToDoComponent', () => {
  let component: InputToDoComponent;
  let fixture: ComponentFixture<InputToDoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputToDoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputToDoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
