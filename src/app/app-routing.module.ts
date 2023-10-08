import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { IsUserGuard } from './core/services/auth-guard.service';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent, title: 'Sign in', data: {animation: 'Login'}},

  {path: '', redirectTo: 'register', pathMatch: 'full'},
  {path: 'register', component: RegisterComponent, title: 'Sign up', data: {animation: 'Register'}},

  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, title: 'Home', canActivate: [IsUserGuard], data: {animation: 'HomePage'}},

  {
    path: '', 
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), 
    canActivate: [IsUserGuard],
    data: {animation: 'Profile'}
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
