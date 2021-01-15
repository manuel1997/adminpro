import { Component, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnInit {

  pageTitulo:string;

  constructor(private router:Router, private titulo:Title, private meta:Meta) {

    this.getDataRoute().subscribe(data =>{

      this.pageTitulo = data.titulo
      this.titulo.setTitle(this.pageTitulo);

      const metaTag:MetaDefinition = {
        name:'description',
        content:this.pageTitulo
      };

      this.meta.updateTag(metaTag);

    })

   }

  ngOnInit() {
  }

  getDataRoute(){

  return this.router.events.pipe(

      filter(evento => evento instanceof ActivationEnd),
      filter((evento:ActivationEnd) => evento.snapshot.firstChild === null),
      map((evento:ActivationEnd) => evento.snapshot.data)
    )

  }

}
