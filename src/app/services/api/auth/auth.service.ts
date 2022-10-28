import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url = localStorage.getItem('URL');
  constructor(private http: HttpClient) {}

  setHeaders() {
    const session_token = localStorage.getItem('SESSION_TOKEN');
    const bearer_token = localStorage.getItem('SESSION_AUTH');

    const headers = new HttpHeaders({
      s_auth: session_token || '',
      authorization: `Bearer ${bearer_token}` || '',
    });

    return { headers };
  }

  getHeaders() {
    return {
      withCredentials: true,
      ...this.setHeaders(),
    };
  }

  login(body: Object) {
    return this.http.post(this.url + `/auth/login`, body, this.getHeaders());
  }

  me() {
    return this.http.get(this.url + '/auth/me', this.getHeaders());
  }

  logout() {
    return this.http.get(this.url + '/auth/logout', this.getHeaders());
  }

  updatePassword(body: object) {
    return this.http.put(
      this.url + '/auth/update-password',
      body,
      this.getHeaders()
    );
  }
}
