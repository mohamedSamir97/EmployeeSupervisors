import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { EmployeesComponent } from './components/employees/employees.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'employees',
    component: EmployeesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  },
  {
     path:'**', component: NotFoundComponent, pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
