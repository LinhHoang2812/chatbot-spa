import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _sessionToken = new BehaviorSubject<string>(null);
  sessionToken(): Observable<string> {
    return this._sessionToken;
  }

  constructor(private http: HttpClient) {}

  login(form: { email: string; password: string }): Observable<any> {
    return this.http.post(env.apiBase + 'sessions', form);
  }

  saveToken(token: string) {
    //localStorage.setItem('token', token);
    this._sessionToken.next(token);
  }
  checkToken(token: string) {
    return this.http.get<boolean>(env.apiBase + `isTokenValid?token=${token}`);
  }
}
