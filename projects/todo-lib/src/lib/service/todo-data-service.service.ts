import { Injectable } from '@angular/core';
import { TodoItem } from '../types/todo';
import { BehaviorSubject, combineLatest, map, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TodoDataService {
  private todos$ = new BehaviorSubject<TodoItem[]>([]);
  private category$ = new BehaviorSubject<string>('All');

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {
    this.loadAllTodos();
  }

  loadAllTodos() {
    const todoStorage = this.localStorage.getItem('todos');
    if (todoStorage) {
      const todos: TodoItem[] = JSON.parse(todoStorage);
      this.todos$.next(todos);
    }
  }

  private get currentTodos() {
    return this.todos$.value;
  }

  getAllTodos$(): Observable<TodoItem[]> {
    return this.todos$.asObservable();
  }

  saveTodo(value: string) {
    let item: TodoItem = {
      id: Date.now().toString(),
      value: value,
      isComplete: false
    }
    this.todos$.next([...this.currentTodos, item]);
  }

  getCategory() {
    return this.category$.value;
  }

  removeTodo(id: string): Observable<any> {
    return this.http.get<TodoItem[]>('/api/delete/' + id).pipe(
      tap(response => this.todos$.next(response))
    );
  }

  checkAll() {
    const allTrue = this.currentTodos.every(item => item.isComplete)
    let newArrTodos = this.currentTodos.map(item => ({
      ...item,
      isComplete: !allTrue
    }));
    this.todos$.next(newArrTodos);
  }

  countNotComplete() {
    return this.currentTodos.filter(item => !item.isComplete).length;
  }

  selectCategory(selectedCategory: string): void {
    this.category$.next(selectedCategory);
  }

  clearCompleted() {
    let newArrTodos = this.currentTodos.filter(item => !item.isComplete);
    this.todos$.next(newArrTodos);
  }

  getFilteredTodos$(): Observable<TodoItem[]> {
    return combineLatest(this.todos$, this.category$).pipe(
      map(([currentTodos, category]) => this.filterTodos(currentTodos, category)),
      tap(todos => this.saveToLocalStorage(todos))
    )
  }

  private filterTodos(todos: TodoItem[], category: string): TodoItem[] {
    switch (category) {
      case 'Active':
        return todos.filter(item => !item.isComplete)
      case 'Completed':
        return todos.filter(item => item.isComplete)
      default:
        return todos
    }
  }

  updateTodoValue(todoItem: TodoItem, newValue: string) {
    let updateTodos = this.currentTodos.map(todo =>
      todo.id === todoItem.id ? { ...todo, value: newValue } : todo
    );
    this.todos$.next(updateTodos)
  }

  private saveToLocalStorage(todo: TodoItem[]) {
    this.localStorage.setItem('todos', JSON.stringify(todo));
  }
}
