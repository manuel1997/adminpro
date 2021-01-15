import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';

import { AdminGuard, LoginGuardGuard, VerificaTokenGuard } from '../services/service.index';
import { ProfileComponent } from './profile/profile.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { HospitalesComponent } from './hospitales/hospitales.component';
import { MedicosComponent } from './medicos/medicos.component';
import { MedicoComponent } from './medicos/medico.component';
import { BusquedaComponent } from './busqueda/busqueda.component';


const routes_pages: Routes = [

      {
        path:'dashboard',
        component: DashboardComponent,
        canActivate:[VerificaTokenGuard],
        data:{titulo:'Dashboard'}
        },
      {path:'progress',component: ProgressComponent, data:{titulo:'Progress'}},
      {path:'graficas1',component: Graficas1Component, data:{titulo:'Graficas'}},
      {path:'promesas',component: PromesasComponent, data:{titulo:'Promesas'}},
      {path:'rxjs',component: RxjsComponent, data:{titulo:'Rxjs'}},
      {path:'account-settings',component: AccountSettingsComponent, data:{titulo:'Ajustes del Tema'}},
      {path:'perfil',component: ProfileComponent, data:{titulo:'perfil de usuario'}},
      {path:'busqueda/:termino',component: BusquedaComponent, data:{titulo:'Buscador'}},

      //Mantenimientos
      {
        path:'usuarios',
        component: UsuariosComponent,
        canActivate:[AdminGuard],
        data:{titulo:'mantenimiento de usuarios'}
        },

      {path:'hospitales',component: HospitalesComponent, data:{titulo:'mantenimiento de hospitales'}},
      {path:'medicos',component: MedicosComponent, data:{titulo:'mantenimiento de medicos'}},
      {path:'medico/:id',component: MedicoComponent, data:{titulo:'actualizar medico'}},
      {path:'', redirectTo: '/dashboard',pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forChild(routes_pages)],
  exports: [RouterModule]
})

export class PagesRoutingModule { }
