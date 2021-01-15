import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalUploadService {

  public tipo:string;
  public id:string;

  public oculto:string = 'oculto'

  public notificacion = new EventEmitter<any>();

  constructor() {
    console.log('modal listo')
   }


   ocultarModal(){
    this.oculto = 'oculto';
    this.tipo = 'null';
    this.id = 'null';
   }

   mostrarModal(tipo:string,id:string){
    this.oculto = '';
    this.id = id;
    this.tipo = tipo;
   }

}