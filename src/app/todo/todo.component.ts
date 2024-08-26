import { Component } from '@angular/core';
import { TodoDataServiceService } from '../service/todo-data-service.service';
import { TodoItem } from '../types/todo';

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

  constructor(private todoDataService: TodoDataServiceService) { }

  ngOnInit() {
    this.todoArray = this.todoDataService.getAllTodos();
  }

  saveTodo() {
    if (this.inputValue.trim()) {
      this.todoDataService.saveTodo(this.inputValue);
      this.todoArray = this.todoDataService.getAllTodos();
    }
    this.inputValue = '';
  }

  deleteTodo(i: number) {
    this.todoDataService.removeTodo(i);
    this.todoArray = this.todoDataService.getAllTodos();
  }

  checkAll() {
    this.todoDataService.checkAll();
    this.todoArray = this.todoDataService.getAllTodos();
  }

  countNotComplete(): number {
    return this.todoDataService.countNotComplete();
  }

  selectCategory(selectedCategory: string) {
    this.todoDataService.selectCategory(selectedCategory);
  }

  clearCompleted() {
    this.todoDataService.clearCompleted();
    this.todoArray = this.todoDataService.getAllTodos();
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
    setTimeout(() => {
      const inputElement = document.getElementById('edit-input-' + index) as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
      }
    }, 0);
  }

  finishEditing() {
    if (this.editIndex !== null) {
      if (this.newTodoValue.trim()) {
        this.todoDataService.updateTodoValue(this.todoArray[this.editIndex].id, this.newTodoValue);
        this.todoArray = this.todoDataService.getAllTodos();
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
}

