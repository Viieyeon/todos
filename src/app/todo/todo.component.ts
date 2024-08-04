import { Component } from '@angular/core';

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
  category = 'All';

  saveTodo() {
    let item: TodoItem = {
      value: this.inputValue,
      isComplete: false
    }
    this.todoArray = [...this.todoArray, item]
    this.inputValue = '';
  }

  checkAll() {
    const allTrue = this.todoArray.every(item => item.isComplete);
    this.todoArray.forEach(item => item.isComplete = !allTrue);
  }

  deleteTodo(i: number) {
    this.todoArray.splice(i, 1);
  }

  countNotComplite(): number {
    let notArray = this.todoArray.filter(item => !item.isComplete)
    return notArray.length;
  }

  selectCategory(selectedCategory: string) {
    this.category = selectedCategory;
  }

  clearCompleted(){
    this.todoArray = this.todoArray.filter(item => !item.isComplete)
  }

  getFilteredTodos() {
    if (this.category === 'All') {
      return this.todoArray;
    } else if (this.category === 'Active') {
      return this.todoArray.filter(item => !item.isComplete);
    } else if (this.category === 'Completed') {
      return this.todoArray.filter(item => item.isComplete);
    }
    return this.todoArray; 
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
        this.todoArray[this.editIndex].value = this.newTodoValue;
        console.log(this.todoArray[this.editIndex])
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

export interface TodoItem {
  value: string,
  isComplete: boolean
}