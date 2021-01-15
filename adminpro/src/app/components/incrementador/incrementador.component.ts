import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {



  @ViewChild('txtprogres',{ read: false, static: false }) txtprogres:ElementRef;

 @Input('nombre') leyenda:string = 'leyenda';
 @Input() progreso:number = 50;

 @Output('actualizaValor') cambioValor: EventEmitter<number> = new EventEmitter();


  constructor() {

   //console.log('leyenda',this.leyenda)
   console.log('progreso',this.progreso)
   }

  ngOnInit() {

  }

  onChange(newValue:number){

      if(newValue >= 100){
          this.progreso = 100;
      }else if(newValue <= 0){
        this.progreso = 0;
      }else{
        this.progreso = newValue;
      }

      this.txtprogres.nativeElement.value = this.progreso

    this.cambioValor.emit(this.progreso)
  }

  cambiarValor(valor:number){

    if(this.progreso >= 100 && valor > 0 ){
      this.progreso = 100
      return;
    }

    if(this.progreso <= 0 && valor < 0){
      this.progreso = 0
      return;
    }
    this.progreso = this.progreso + valor;

    this.cambioValor.emit(this.progreso)

    this.txtprogres.nativeElement.focus();

  }

}
