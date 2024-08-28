import { Component } from '@angular/core';
import { TodoDataServiceService } from '../service/todo-data-service.service';
import { TodoItem } from '../types/todo';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent {
  inputValue: string = '';
  todoArray: TodoItem[] = [];
  countNot = 0;
  categories = ['All', 'Active', 'Completed'];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private todoDataService: TodoDataServiceService) { }

  ngOnInit() {
    this.todoDataService.getAllTodos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((todos: TodoItem[]) => {
        this.todoArray = todos;
      })
  }

  saveTodo() {
    if (this.inputValue.trim()) {
      this.todoDataService.saveTodo(this.inputValue);
    }
    this.inputValue = '';
  }

  deleteTodo(id: string) {
    this.todoDataService.removeTodo(id);
  }

  checkAll() {
    this.todoDataService.checkAll();
  }

  countNotComplete(): number {
    return this.todoDataService.countNotComplete();
  }

  selectCategory(selectedCategory: string) {
    this.todoDataService.selectCategory(selectedCategory);
  }

  clearCompleted() {
    this.todoDataService.clearCompleted();
  }

  getFilteredTodos(): TodoItem[] {
    return this.todoDataService.getFilteredTodos();
  }

  getCategory() {
    return this.todoDataService.getCategory();
  }

  editIndex: number | null = null;
  newTodoValue: string = '';

  startEditing(index: number) {
    this.editIndex = index;
    this.newTodoValue = this.todoArray[index].value;
  }

  finishEditing() {
    if (this.editIndex !== null) {
      if (this.newTodoValue.trim()) {
        this.todoDataService.updateTodoValue(this.todoArray[this.editIndex], this.newTodoValue);
      }
      this.editIndex = null;
      this.newTodoValue = '';
    }
  }

  handleBlur() {
    this.finishEditing();
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.finishEditing();
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

