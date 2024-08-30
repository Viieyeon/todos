import { Injectable } from '@angular/core';
import { TodoItem } from '../types/todo';
import { BehaviorSubject, catchError, combineLatest, map, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TodoDataService {
  private todos$ = new BehaviorSubject<TodoItem[]>([]);
  private category$ = new BehaviorSubject<string>('All');

  constructor(private http: HttpClient) {
    this.loadAllTodos();
  }

  loadAllTodos(){
    const todoStorage = localStorage.getItem('todos');
    if (todoStorage) {
      const todos: TodoItem[] = JSON.parse(todoStorage);
      this.todos$.next(todos);
    }
  }

  getAllTodos$(): Observable<TodoItem[]> {
    return this.todos$.asObservable();
  }

  saveTodo(value: string) {
    const id = Date.now().toString();
    let item: TodoItem = {
      id: id,
      value: value,
      isComplete: false
    }
    const currentTodos = this.todos$.value;
    this.todos$.next([...currentTodos, item]);
  }

  getCategory() {
    return this.category$.value;
  }

  removeTodo(id: string): Observable<any> {
    return this.http.get<TodoItem[]>('/api/delete/' + id).pipe(
      tap((response: TodoItem[]) => {
        this.todos$.next(response);
      })
    );
  }

  checkAll() {
    const currentTodos = this.todos$.value;
    const allTrue = currentTodos.every(item => item.isComplete)
    let newArrTodos = currentTodos.map(item => ({
      ...item,
      isComplete: !allTrue
    }));
    this.todos$.next(newArrTodos);
  }

  countNotComplete() {
    const currentTodos = this.todos$.value;
    return currentTodos.filter(item => !item.isComplete).length;
  }

  selectCategory(selectedCategory: string): void {
    this.category$.next(selectedCategory);
  }

  clearCompleted() {
    const currentTodos = this.todos$.value;
    let newArrTodos = currentTodos.filter(item => !item.isComplete);
    this.todos$.next(newArrTodos);
  }

  getFilteredTodos$(): Observable<TodoItem[]> {
    return combineLatest(this.todos$, this.category$).pipe(
      map(([currentTodos, category]) => {
        if (category === 'All') {
          return currentTodos;
        } else if (category === 'Active') {
          return currentTodos.filter(item => !item.isComplete);
        } else if (category === 'Completed') {
          return currentTodos.filter(item => item.isComplete);
        }
        return currentTodos;
      }),
      tap(todos => this.saveToLocalStorage(todos))
    )
  }

  updateTodoValue(todoItem: TodoItem, newValue: string) {
    const currentTodos = this.todos$.value;
    let updateTodos = currentTodos.map(todo => 
      todo.id === todoItem.id ? {...todo, value: newValue} : todo
    );
    this.todos$.next(updateTodos)
  }

  private saveToLocalStorage(todo: TodoItem[]) {
    localStorage.setItem('todos', JSON.stringify(todo));
  }
}
