import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Hero } from '../../interfaces/hero.interface';
import { delay, switchMap } from 'rxjs';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styles: [``],
})
export class HeroPageComponent implements OnInit{

  //Se pone opcional ya que en caso de no haber ningun hero registrado
  public hero?: Hero;

  constructor(
    private heroService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    ){}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        //delay(2000),
        //de params se desetructura y se obtienen el id
        switchMap( ({id}) => this.heroService.getHeroById(id) ),
      ).subscribe( hero => {
        if( !hero ) return this.router.navigate( ['/heroes/list'] );

        this.hero = hero;
        return;
      }
      )
  }

  goBack(): void{
    this.router.navigateByUrl('heroes/list');
  }

 }
