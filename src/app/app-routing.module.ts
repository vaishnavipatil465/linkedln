import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AddPostComponent } from './add-post/add-post.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  { path: '', redirectTo: 'add-post', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'add-post', component: AddPostComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
