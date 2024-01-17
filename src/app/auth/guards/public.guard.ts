import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, UrlSegment, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable({providedIn: 'root'})
export class PublicGuard implements CanMatch, CanActivate{

  constructor(
    private authServie: AuthService,
    private router: Router,
  ) { }


  private checkAuthStatus(): boolean | Observable<boolean> {
    return this.authServie.checkAuthentication()
      .pipe(
        tap( isAuthenticated => {
          if( isAuthenticated ) {
            this.router.navigate([ './' ])
          }
        } ),
        map( isAuthenticated => !isAuthenticated )
        //Se agrega el map ya que se devuelve un false que causa error en los dos CAN...
      )
  }


  canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
    /* console.log({ route, segments });
    return true; */
    return this.checkAuthStatus();
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    /* console.log({ route, state });
    return true; */
    return this.checkAuthStatus();
  }
}
