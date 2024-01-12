import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: [
  ]
})
export class SearchPageComponent {
  //Cuando se usan formularios reactivos (a cualquier elemento de form) se tiene que importar 'ReactiveFormsModule'
  //Importarlo a nivel de seccion (heroes.module)
  public searchInput = new FormControl('');
  public heroes: Hero[]=[];
  public selectedHero?: Hero;

  constructor( private heroesService : HeroesService ){}

  searchHero(){
    const value : string = this.searchInput.value || '';

    this.heroesService.getSuggestion(value)
      .subscribe( heroes => this.heroes = heroes);
  }

  opcionSeleccionada( event : MatAutocompleteSelectedEvent ):void{
    if( !event.option.value ){
      this.selectedHero = undefined;
      return;
    }

    const hero: Hero = event.option.value;
    this.searchInput.setValue( hero.superhero );

  }
}
