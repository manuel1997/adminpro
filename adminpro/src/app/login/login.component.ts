import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';


declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email:string;
  recuerdame:boolean = false;

  auth2:any

  constructor(
    private router:Router,
    public _usuarioService:UsuarioService
    ) { }

  ngOnInit() {
    init_plugins();
   
    this.email = localStorage.getItem('email') || '';
    if(this.email.length > 1){
      this.recuerdame = true;
    }
    this.googleInit();
  }

  googleInit(){
    gapi.load('auth2',() =>{
      this.auth2 = gapi.auth2.init({
        client_id:'283266106837-u5o8qck9o6mo0qmpjpav4219na1gvoq0.apps.googleusercontent.com',
        cookiepolicy:'single_host_origin',
        scope:'profile email'
      });
      this.attachSignin(document.getElementById('btnGoogle'));
    });
  }

  attachSignin(element){
    this.auth2.attachClickHandler(element, {}, (googleUser) => {
    //let profile = googleUser.getBasicProfile();
    let token = googleUser.getAuthResponse().id_token;
    
      this._usuarioService.loginGoole(token)
        .subscribe( () =>  window.location.href='/dashboard')

    });
  }

  ingresar(forma:NgForm){

    if(forma.invalid){
      return;
    }

    let usuario = new Usuario(null,forma.value.email, forma.value.password)

    this._usuarioService.login(usuario,forma.value.recuerdame)
        .subscribe(resp => this.router.navigate(['/dashboard']));
    
  }

}
