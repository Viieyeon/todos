import { Component } from '@angular/core';
import { TodoComponent } from "./todo/todo.component";

@Component({
  selector: 'todo-lib',
  standalone: true,
  imports: [TodoComponent],
  template: `
    <todo-lib-todo></todo-lib-todo>
  `,
  styles: ``
})
export class TodoLibComponent {

}
