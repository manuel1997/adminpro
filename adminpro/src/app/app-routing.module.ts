import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages/pages.component';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';
import { NopagefoudComponent } from './shared/nopagefoud/nopagefoud.component';
import { LoginGuardGuard } from './services/service.index';



const routes: Routes = [
  {path:'login',component: LoginComponent},
  {path:'register',component: RegisterComponent},

  { 
  path:'',
  component:PagesComponent,
  canActivate:[LoginGuardGuard],
  loadChildren:'./pages/pages.module#PagesModule'
   },

  {path:'**', component: NopagefoudComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
