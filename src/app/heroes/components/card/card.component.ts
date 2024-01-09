import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'heroes-hero-card',
  templateUrl: './card.component.html',
})
export class CardComponent implements OnInit {

  @Input()
  public hero!: Hero;

  ngOnInit(): void {
    //Validacion en caso de que no encuentre heroes
    if( !this.hero) throw Error('La propiedad Hero es requerida');
  }
}
