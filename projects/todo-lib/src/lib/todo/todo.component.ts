import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TodoDataService } from '../service/todo-data-service.service';
import { TodoItem } from '../types/todo';
import { catchError, EMPTY, map, Observable, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'todo-lib-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoComponent {
  inputValue: string = '';
  todoArrayLength$: Observable<number>;
  filteredTodos$: Observable<TodoItem[]>;
  categories = ['All', 'Active', 'Completed'];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private todoDataService: TodoDataService) {
    this.todoArrayLength$ = this.todoDataService.getAllTodos$().pipe(map(items => items.length));
    this.filteredTodos$ = this.todoDataService.getFilteredTodos$();
  }

  saveTodo() {
    if (this.inputValue.trim()) {
      this.todoDataService.saveTodo(this.inputValue);
    }
    this.inputValue = '';
  }

  deleteTodo(id: string) {
    this.todoDataService.removeTodo(id).pipe(
      takeUntil(this.destroy$),
      catchError(error => {
        console.error('Error deleting todo:', error);
        return EMPTY; 
      })
    )
    .subscribe();
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

  getCategory() {
    return this.todoDataService.getCategory();
  }

  editIndex: number | null = null;
  newTodo!: TodoItem;

  startEditing(index: number, item: TodoItem) {
    this.editIndex = index;
    this.newTodo = item;
  }

  finishEditing() {
    if (this.editIndex !== null) {
      if (this.newTodo.value.trim()) {
        this.todoDataService.updateTodoValue(this.newTodo, this.newTodo.value);
      }
      this.editIndex = null;
      this.newTodo.value = '';
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
