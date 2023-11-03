import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}
  canActivate(): Observable<boolean> | boolean {
    return  this.authService.currentUser$.pipe(
      map((user) => {
        if (user != null && user != undefined) {
          return true;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Not authorized',
          });
          this.router.navigate(['/login']);
          return false;
        }
      })
    );


  }
}
