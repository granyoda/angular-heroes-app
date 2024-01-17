import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, UrlSegment, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanMatch, CanActivate{
  //Los GUARD se implementan por lo regular en el routing, en path que se requiere proteger
  constructor(
    private authServie: AuthService,
    private router: Router,
  ) { }

  private checkAuthStatus(): boolean | Observable<boolean> {
    return this.authServie.checkAuthentication()
      .pipe(
        tap( isAuthenticated => {
          if( !isAuthenticated ) {
            this.router.navigate([ './auth/login' ])
          }
        } )
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
