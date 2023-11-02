import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService : AuthService, private messageService: MessageService){}
  canActivate(): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map(user => {
        if(user) return true;
        this.messageService.add({ severity: 'error', summary: 'error', detail: 'Not authorized' });
        return false;
      })

    );
  }

}
