import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoLibComponent } from '../../projects/todo-lib/src/public-api';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TodoInterceptor } from '../../projects/todo-lib/src/lib/interceptor/todo.interceptor';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TodoLibComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TodoInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
