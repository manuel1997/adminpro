import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { SubirArchivoService } from 'src/app/services/service.index';
import { ModalUploadService } from './modal-upload.service';
const swal = require('sweetalert');

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {


  imagenSubir:File;
  imagenTemp:any;

  constructor(
    public _subirArchivo:SubirArchivoService,
     public _modalUploadService:ModalUploadService
     ) {}

  ngOnInit() {
  }

  cerrarModal(){
    this.imagenTemp = null;
    this.imagenSubir = null
    this._modalUploadService.ocultarModal();
  }

  seleccionImagen(archivo){

    if(!archivo){
      this.imagenSubir = null
      return
    }

    if(archivo.type.indexOf('image')<0){
      swal('solo imagenes','el archivo seleccionado no es una imagen','error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL(archivo);

    reader.onloadend = () => this.imagenTemp = reader.result;

  }

  subirImagen(){
console.log('responde')
    this._subirArchivo.subirArchivo(this.imagenSubir,this._modalUploadService.tipo,this._modalUploadService.id)
      .then(resp => {

          console.log(resp);
          this._modalUploadService.notificacion.emit(resp);
          this.cerrarModal();
      })
      .catch(err =>{
        console.log('Error en la carga...');
      });
  }

}
