import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { LOCAL_URL, REMOTE_URL } from './configs/url';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'gardner-sceduling-system';

  show = false;

  constructor(private http: HttpClient) {
    this.show = false;
    this.http.get('http://localhost:3000/api/v1/health').subscribe(
      (res) => {
        localStorage.setItem('URL', LOCAL_URL);
        this.show = true;
      },
      (err) => {
        localStorage.setItem('URL', REMOTE_URL);
        this.show = true;
      }
    );
  }
}
