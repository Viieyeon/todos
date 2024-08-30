import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TodoItem } from '../types/todo';

@Injectable()
export class TodoInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('/api/delete/')) {
      const id = this.getTodoId(req);
      if (id) {
        this.removeTodoFromLocalStorage(id);
        let newArray = JSON.parse(localStorage.getItem('todos') || '[]');
        const response = new HttpResponse({
          status: 200,
          body: newArray 
        });
      
        return of(response);
      }
    }

    return next.handle(req);
  }

  private getTodoId(req: HttpRequest<any>): string | null{
    const urlId = req.url.split('/')
    return urlId.length ? urlId[urlId.length - 1] : null;
  }

  private removeTodoFromLocalStorage(id: string){
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    const updatedTodos = todos.filter((todo: TodoItem) => todo.id !== id);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  }
}

