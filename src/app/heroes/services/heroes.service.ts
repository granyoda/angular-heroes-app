import { Hero } from './../interfaces/hero.interface';
import { Injectable } from '@angular/core';
import { HeroesModule } from '../heroes.module';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class HeroesService {
  //peticion a la API
  private baseURL: string = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  getHeroes(): Observable<Hero[]>{
    return this.httpClient.get<Hero[]>(`${ this.baseURL }/heroes`)
  }

  getHeroById( id: string ): Observable<Hero | undefined>{
    return this.httpClient.get<Hero>(`${ this.baseURL }/heroes/${ id }`)
      .pipe(
        //en caso de marcar error se analiza y devuelde el error mediante otro observable (of)
        catchError( error => of(undefined) )
      );
  }
}
