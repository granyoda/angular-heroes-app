import { Hero } from './../interfaces/hero.interface';
import { Injectable } from '@angular/core';
import { HeroesModule } from '../heroes.module';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class HeroesService {
  //peticion a la API
  private baseURL: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getHeroes(): Observable<Hero[]>{
    return this.http.get<Hero[]>(`${ this.baseURL }/heroes`)
  }

  getHeroById( id: string ): Observable<Hero | undefined>{
    return this.http.get<Hero>(`${ this.baseURL }/heroes/${ id }`)
      .pipe(
        //en caso de marcar error se analiza y devuelde el error mediante otro observable (of)
        catchError( error => of(undefined) )
      );
  }

  getSuggestion(query: string):Observable<Hero[]> {
    return this.http.get<Hero[]>(`${ this.baseURL }/heroes?q=${query}&limit=6`);
  }


  addhero(hero: Hero): Observable<Hero>{
    return this.http.post<Hero>(`${ this.baseURL }/heroes`,hero);
    //el hero del segundo parametro sería como el body del POST
  }

  updateHero(hero: Hero): Observable<Hero>{
    if( !hero.id ) throw Error('Hero.id es requerido');
    return this.http.patch<Hero>(`${ this.baseURL }/heroes/${ hero.id }`,hero);
    //el hero del segundo parametro sería como el body del PATH, solo modificando la parte requerida
  }

  deleteHeroById(id: string): Observable<boolean>{
    return this.http.delete(`${ this.baseURL }/heroes/${ id }`)
      //se hace la consulta y se no existe el elemento tomamos el error y devolvemos FALSE
      .pipe(
        //En caso de que no marque error (que so exista el elemento enviamos un TRUE)
        map( resp => true),
        catchError( err => of(false)),
      );
      //Esto con el proposito de cumplir la respuesta que necesita el Observable

  }


}
