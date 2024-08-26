import { Injectable } from '@angular/core';
import { TodoItem } from '../todo/todo.component';

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
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  getCategory(){
    return this.category;
  }

  removeTodo(index: number) {
    this.todos.splice(index, 1);
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  checkAll() {
    const allTrue = this.todos.every(item => item.isComplete);
    this.todos = this.todos.map(item => ({
      ...item,
      isComplete: !allTrue
    }));
    localStorage.setItem('todos', JSON.stringify(this.todos));
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

  updateTodoValue(index: number, newValue: string) {
    if (this.todos[index]) {
      this.todos[index].value = newValue;
      this.saveToLocalStorage();
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }
}
