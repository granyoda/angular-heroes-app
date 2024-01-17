import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user.interface';

@Injectable({providedIn: 'root'})
export class AuthService {

  //Se coloca private en las funciones para para que solo se puedan manipular en este servicio
  private baseURL: string = environment.baseUrl;
  private user?: User;

  constructor(private http: HttpClient) { }


  get currenUser():User | undefined{
    if( !this.user ) return undefined;

    //structuredClore hace un clone del valor para que no sea manipulado
    return structuredClone( this.user )
  }


  login(mail: string, pasword: string):Observable<User>{

    return this.http.get<User>(`${ this.baseURL }/users/1`)
    .pipe(
      tap( user => { this.user = user; }),
      tap( user => localStorage.setItem( 'token', user.id.toString() ) ),
    )
  }


  checkAuthentication(): Observable<boolean> {
    if( !localStorage.getItem('token') ) return of(false)

    const token = localStorage.getItem('token');
    return this.http.get<User>(`${ this.baseURL }/users/1`)
      .pipe(
        tap( user => this.user= user ),
        map( user => !!user ),
        catchError( err => of(false))

        /**
        * ? En este caso es como si:
        * * x=1;    !x; (esto es FALSE)   !!x (esto es true)
        * ? Basicamente se esta haciendo una comparacion del valor que tiene para devolver el booleano
         */
      );
  }


  logout(){
    this.user = undefined;
    localStorage.clear();
  }

}
