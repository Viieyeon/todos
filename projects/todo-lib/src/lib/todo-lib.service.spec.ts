import { TestBed } from '@angular/core/testing';

import { TodoLibService } from './todo-lib.service';

describe('TodoLibService', () => {
  let service: TodoLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
