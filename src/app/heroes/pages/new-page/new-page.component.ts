import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { filter, switchMap } from 'rxjs';
import { ConfirmDialogComponent } from '../../components/confirmDialog/confirmDialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id:               new FormControl<string>(''),
    superhero:        new FormControl<string>('', { nonNullable: true }),
    publisher:        new FormControl<Publisher>( Publisher.DCComics ),
    alter_ego:        new FormControl(''),
    first_appearance: new FormControl(''),
    characters:       new FormControl(''),
    alt_img:          new FormControl(''),
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics'},
    { id: 'Marvel Comics', desc: 'Marvel - Comics' }
  ];

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    ) { }

  ngOnInit(): void {
    // si en el url no incluye la palabra edit ent no hay problema y no se hace lo demas
    if( !this.router.url.includes('edit') ) return;

    this.activatedRoute.params
      .pipe(
        //ID se obtiene de desestruturar de params que se resiven del url, los valores que tiene definidos que se tienen que resivir
        switchMap( ({id}) => this.heroesService.getHeroById( id ) ),
      ).subscribe( hero => {

        // si no existe el hero ent se saca de la pagina
        if( !hero ) return this.router.navigateByUrl('/');

        this.heroForm.reset( hero );
        return;
      } );
      //.subscribe(id => {});

  }

  get currentHero(): Hero{
    const hero = this.heroForm.value as Hero;

    return hero;
  }

  onSubmit():void{
    /* console.log({
      formIsValid: this.heroForm.valid,
      value: this.heroForm.value
    }) */

    //Si no es valido el formulario ent retorna y termina
    if( this.heroForm.invalid ) return;

    // Si no ent primero comprueba si hay in ID, ent quiere actualizar
    if( this.currentHero.id ){
      this.heroesService.updateHero( this.currentHero )
        .subscribe( hero => {
          this.mostrarSnackbar(`${ hero.superhero } actualizado!`);

        } );
        return;
    }

    //Si no ent quiere crear uno nuevo
    this.heroesService.addhero( this.currentHero )
      .subscribe( hero => {
        this.mostrarSnackbar(`${ hero.superhero } creado con exito!`);
        this.router.navigate([ '/heroes/edit',hero.id ]);
      } );
  }

  mostrarSnackbar( message: string ): void{
    this.snackbar.open( message, 'Ok', {
      duration: 2000
    });
  }

  onDeleteHero():void{
    if( !this.currentHero.id ) throw Error('Se requiere el ID de Heroe');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    //Esta funcion hace lo mismo que la que esta comentada, solo mejor optimizada
    dialogRef.afterClosed()
    .pipe(
      filter( ( result: boolean ) => result ),
      switchMap( () => this.heroesService.deleteHeroById( this.currentHero.id ) ),
      filter( ( wasDeleted: boolean ) => wasDeleted ),
    ).subscribe( () =>{
      this.router.navigate(['/heroes']);
    } )
    /* dialogRef.afterClosed().subscribe(result => {
      if( !result ) return;

      this.heroesService.deleteHeroById( this.currentHero.id )
      .subscribe( wasDeleted =>{
        if( wasDeleted )
          this.router.navigate(['/heroes']);
      });
      this.router.navigate(['/heroes']);
    }); */
  }

}
