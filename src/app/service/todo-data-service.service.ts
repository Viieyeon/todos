import { Injectable } from '@angular/core';
import { TodoItem } from '../types/todo';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TodoDataServiceService {

  private todos = new BehaviorSubject<TodoItem[]>([]);
  private category = 'All';

  constructor() {
    this.loadAllTodos();
    this.todos.subscribe(todo => this.saveToLocalStorage(todo));
  }

  loadAllTodos(){
    const todoStorage = localStorage.getItem('todos');
    if (todoStorage) {
      const todos: TodoItem[] = JSON.parse(todoStorage);
      this.todos.next(todos);
    }
  }

  getAllTodos(): Observable<TodoItem[]> {
    return this.todos.asObservable();
  }

  saveTodo(value: string) {
    const id = Date.now().toString();
    let item: TodoItem = {
      id: id,
      value: value,
      isComplete: false
    }
    const currentTodos = this.todos.value;
    this.todos.next([...currentTodos, item]);
  }

  getCategory() {
    return this.category;
  }

  removeTodo(id: string) {
    const currentTodos = this.todos.value;
    let newArrTodos = currentTodos.filter(todo => todo.id !== id);
    this.todos.next(newArrTodos);
  }

  checkAll() {
    const currentTodos = this.todos.value;
    const allTrue = currentTodos.every(item => item.isComplete)
    let newArrTodos = currentTodos.map(item => ({
      ...item,
      isComplete: !allTrue
    }));
    this.todos.next(newArrTodos);
  }

  countNotComplete() {
    const currentTodos = this.todos.value;
    return currentTodos.filter(item => !item.isComplete).length;
  }

  selectCategory(selectedCategory: string): void {
    this.category = selectedCategory;
  }

  clearCompleted() {
    const currentTodos = this.todos.value;
    let newArrTodos = currentTodos.filter(item => !item.isComplete);
    this.todos.next(newArrTodos);
  }

  getFilteredTodos(): TodoItem[] {
    const currentTodos = this.todos.value;
    if (this.category === 'All') {
      return currentTodos;
    } else if (this.category === 'Active') {
      return currentTodos.filter(item => !item.isComplete);
    } else if (this.category === 'Completed') {
      return currentTodos.filter(item => item.isComplete);
    }
    return currentTodos;
  }

  updateTodoValue(todoItem: TodoItem, newValue: string) {
    const currentTodos = this.todos.value;
    let updateTodos = currentTodos.map(todo => 
      todo.id === todoItem.id ? {...todo, value: newValue} : todo
    );
    this.todos.next(updateTodos)
  }

  private saveToLocalStorage(todo: TodoItem[]) {
    localStorage.setItem('todos', JSON.stringify(todo));
  }
}
