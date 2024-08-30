import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoLibComponent } from './todo-lib.component';

describe('TodoLibComponent', () => {
  let component: TodoLibComponent;
  let fixture: ComponentFixture<TodoLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoLibComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
