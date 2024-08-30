import { Component } from '@angular/core';
import { TodoComponent } from "./todo/todo.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'todo-lib',
  standalone: true,
  imports: [TodoComponent, HttpClientModule],
  template: `
    <todo-lib-todo></todo-lib-todo>
  `,
  styles: ``,
})
export class TodoLibComponent {

}
