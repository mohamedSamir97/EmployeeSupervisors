import { Injectable } from '@angular/core';
import { ReplaySubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/apiResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.apiUrl;

  private currentUserSource = new ReplaySubject<User | null>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) {}
  login(model: any) {
    return this.http.post(this.baseUrl + 'users/login', model).pipe(
      map((response: any) => {
        debugger;
        if (response.success) {
          const user = response.user;
          if (user) {
            this.seCurrentUser(user);
          }
        }
        return response;
      })
    );
  }

  seCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
