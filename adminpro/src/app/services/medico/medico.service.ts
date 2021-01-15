import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { map } from 'rxjs/operators';
import { Medico } from 'src/app/models/medico.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

const swal = require('sweetalert');

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos:number = 0;

  constructor(
    public http:HttpClient,
    public _usuarioService:UsuarioService,
    public usuarioService:UsuarioService
  ) { }

  cargarMedicos(){
    let url = URL_SERVICIOS + '/medico'
    return this.http.get(url)
      .pipe(map( (resp:any) => {
      this.totalMedicos = resp.total;
      return resp.medicos
     }));
  }

  cargarMedico(id:string){
    let url = URL_SERVICIOS + '/medico/' + id;
    return this.http.get(url)
      .pipe(map( (resp:any) => {
      return resp.medico
     }));
  }

  guardarMedico(medico:Medico){

    if(medico._id){
      let url = URL_SERVICIOS + '/medico/' + medico._id + '?token=' + this.usuarioService.token;
      return this.http.put(url,medico).pipe(map( (resp:any) => {
        swal('Medico creado',medico.nombre,'success');
        return resp.medico
      }));
    }else{
      let url = URL_SERVICIOS + '/medico/' + '?token=' + this.usuarioService.token;
      return this.http.post(url,medico).pipe(map( (resp:any) => {
        swal('Medico actualizado',medico.nombre,'success');
        return resp.medico
      }));
    }

 

  }

  buscarMedicos(termino:string){
    let url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;
    return this.http.get(url).pipe(map( (resp:any) => resp.medicos));
  }

  borraMedico(id:string){

    let url = URL_SERVICIOS + '/medico/' + id + '?token=' + this.usuarioService.token;
    return this.http.delete(url)
    .pipe(map( resp => {
        swal('Medico borrado','El medico a sido borrado','success');
        return true;
    }));

  }

}
