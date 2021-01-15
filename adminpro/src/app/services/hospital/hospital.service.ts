import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { map } from 'rxjs/operators';


const swal = require('sweetalert');

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  totalHospitales:number = 0;

  constructor(
    public http:HttpClient,
    public _usuarioService:UsuarioService
    ) { }

  cargarHsopitales(){
  let url = URL_SERVICIOS + '/hospital'
  return this.http.get(url)
    .pipe(map( (resp:any) => {
      this.totalHospitales = resp.total;
      return resp.hospitales
     }));
  }

  obtenerHospital(id:string){
    let url = URL_SERVICIOS + '/hospital/' + id;
    return this.http.get(url).pipe(map( (resp:any) => resp.hospital));
  }

  borrarHospital( id: string ){

    let url = URL_SERVICIOS + '/hospital/' + id + '?token=' + this._usuarioService.token;
    console.log(url)
    return this.http.delete(url)
    .pipe(map( resp => {
        swal('Hospital borrado','El hospital a sido borrado','success');
        return true;
    }));
  }

  crearHospital( nombre: string ){

    let url = URL_SERVICIOS+ '/hospital' + '?token=' + this._usuarioService.token;
    return this.http.post(url,{nombre})
          .pipe(map((resp:any) => {
            swal('Hospital creado',nombre,'success');
              return resp.hospital
          }));

  }

  buscarHospital( termino: string ){
    let url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;
    return this.http.get(url).pipe(map( (resp:any) => resp.hospitales));
  }

  actualizarHospital( hospital ){
    let url = URL_SERVICIOS + '/hospital/' + hospital._id + '?token=' + this._usuarioService.token;
    return this.http.put(url,hospital)
    .pipe(map( (resp:any) => {
      swal('Hospital actualizado',hospital.nombre,'success'); 
     return resp.hospital;
    })
    );
  }

}
