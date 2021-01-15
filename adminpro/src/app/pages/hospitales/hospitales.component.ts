import { Component, OnInit } from '@angular/core';
import { HospitalService } from 'src/app/services/service.index';
import { Hospital } from 'src/app/models/hospital.model';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

const swal = require('sweetalert');



@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales:Hospital[] = [];
  totalHospitales: number = 0;

  cargando:boolean = true;
  

  constructor(
    public _hospitalService:HospitalService,
    public _modalUploadService:ModalUploadService
    ) { }

  ngOnInit() {
    this.cargarHospitales();

    this._modalUploadService.notificacion
        .subscribe( () => this.cargarHospitales())
  }

  buscarHospital(termino:string){

    if(termino.length <= 0){
      this.cargarHospitales();
      return;
    }

    this._hospitalService.buscarHospital(termino)
      .subscribe( hospitales => this.hospitales = hospitales);

  }

  cargarHospitales(){
    this.cargando = true;
    this._hospitalService.cargarHsopitales()
      .subscribe( hospitales => {
        this.totalHospitales = this._hospitalService.totalHospitales;
        this.hospitales = hospitales;
        this.cargando = false;
      });
  }


  guardarHospital(hospital:Hospital){
    this._hospitalService.actualizarHospital(hospital)
      .subscribe( () => this.cargarHospitales())
  }

  borrarHospital(hospital:Hospital){
    this._hospitalService.borrarHospital(hospital._id)
      .subscribe( () => this.cargarHospitales())
  }

  crearHospital(){
    swal({
      title:'Crear hospital',
      text:'Ingrese el nombre del hospital',
      content:'input',
      icon:'info',
      buttons:true,
      dangerMode:true
    }).then( (valor:string) => {

      if(!valor || valor.length === 0){
        return;
      }
      this._hospitalService.crearHospital(valor)
      .subscribe( () => this.cargarHospitales())
    })
  }

  actualizarImagen(hospital){
    this._modalUploadService.mostrarModal('hospitales', hospital._id)
  }

}
