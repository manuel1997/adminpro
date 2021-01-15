import { Injectable } from '@angular/core';
import { CanActivate,Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    public _usaurioService:UsuarioService,
    public router:Router
  ){}

  canActivate(){

    if(this._usaurioService.usuario.role === 'ADMIN_ROLE'){
      return true;
    }else{
      console.log('bloqueado por el admin guard')
      this._usaurioService.logout();
      return false;
    }

    return true;
  }
  
}
