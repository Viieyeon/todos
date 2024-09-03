import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TodoItem } from '../types/todo';

@Injectable()
export class TodoInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('/api/delete/')) {
      const id = req.url.split('/').pop();
      if (id) {
        let newArray = this.removeTodoFromLocalStorage(id);
        const response = new HttpResponse({
          status: 200,
          body: newArray 
        });
        return of(response);
      }
    }
    return next.handle(req);
  }

  private removeTodoFromLocalStorage(id: string): TodoItem[]{
    const todos = this.getTodoStorage();
    const updatedTodos = todos.filter((todo: TodoItem) => todo.id !== id);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    return updatedTodos
  }

  private getTodoStorage(){
    return JSON.parse(localStorage.getItem('todos') || '[]')
  }
}

