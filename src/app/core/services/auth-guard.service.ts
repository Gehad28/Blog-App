import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    if(localStorage.getItem('id')){
      return true;
    }
    inject(Router).navigate(['']);
    return false;
  }
}

export const IsUserGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(AuthGuardService).canActivate(route, state);
}

