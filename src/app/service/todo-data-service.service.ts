import { Injectable } from '@angular/core';
import { TodoItem } from '../types/todo';


@Injectable({
  providedIn: 'root'
})
export class TodoDataServiceService {

  private todos: TodoItem[] = [];
  private category = 'All';

  constructor() { 
    this.todos = this.getAllTodos();
  }

  getAllTodos(): TodoItem[] {
    const todos = localStorage.getItem('todos');
    return todos ? JSON.parse(todos) : [];
  }

  saveTodo(value: string){
    const id = Date.now().toString();
    let item: TodoItem = {
      id: id,
      value: value,
      isComplete: false
    }
    this.todos = [...this.todos, item];
    this.saveToLocalStorage();
  }

  getCategory(){
    return this.category;
  }

  removeTodo(id: string) {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.saveToLocalStorage();
  }

  checkAll() {
    const allTrue = this.todos.every(item => item.isComplete);
    this.todos = this.todos.map(item => ({
      ...item,
      isComplete: !allTrue
    }));
    this.saveToLocalStorage();
  }

  countNotComplete() {
    return this.todos.filter(item => !item.isComplete).length;
  }

  selectCategory(selectedCategory: string): void {
    this.category = selectedCategory;
  }

  clearCompleted() {
    this.todos = this.todos.filter(item => !item.isComplete);
    this.saveToLocalStorage();
  }

  getFilteredTodos(): TodoItem[] {
    if (this.category === 'All') {
      return this.todos;
    } else if (this.category === 'Active') {
      return this.todos.filter(item => !item.isComplete);
    } else if (this.category === 'Completed') {
      return this.todos.filter(item => item.isComplete);
    }
    return this.todos;
  }

  updateTodoValue(todoItem: TodoItem, newValue: string) {
    let todo = this.todos.find(todo => todo.id === todoItem.id);
    if (todo) {
      todo.value = newValue;
      this.saveToLocalStorage();
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }
}
