import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AddPostComponent } from './add-post/add-post.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommentBoxComponent } from './comment-box/comment-box.component';
import {NgxPaginationModule} from 'ngx-pagination';



@NgModule({
  declarations: [
    AppComponent,
    AddPostComponent,
    LoginComponent,
    CommentBoxComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
