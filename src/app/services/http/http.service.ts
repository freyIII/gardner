import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { QueryParams } from 'src/app/models/queryparams.interface';
import { Subject, Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

type Methods = 'get' | 'post' | 'put' | 'delete' | 'patch';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private loadingSubject: Subject<boolean> = new Subject();
  get loading(): Observable<boolean> {
    return this.loadingSubject;
  }
  constructor(public http: HttpClient) {}

  getHeaders() {
    var session_token = localStorage.getItem('SESSION_TOKEN');
    var bearer_token = localStorage.getItem('SESSION_AUTH');

    var headers = new HttpHeaders({
      s_auth: session_token || '',
      authorization: `Bearer ${bearer_token}` || '',
    });
    // console.log(headers);
    return { headers };
  }

  start<T>(method: Methods, endpoint: string, body?: any, query?: QueryParams) {
    var queryArray: Array<string> = [];
    if (query) {
      if (query.filter) {
        queryArray.push(
          `searchVal=${
            query.filter.value
          }&searchFields=${query.filter.fields.join()}`
        );
      }
      if (query.find) {
        query.find.forEach((f) => {
          var str = f.field + f.operator + f.value;
          queryArray.push(str);
        });
      }
      if (query.fields) queryArray.push(`fields=${query.fields}`);
      if (query.limit) queryArray.push(`limit=${query.limit}`);
      if (query.page) queryArray.push(`page=${query.page}`);
      if (query.sort) queryArray.push(`sort=${query.sort}`);
      if (query.populates) {
        var temp: Array<string> = [];
        query.populates.forEach((f) => {
          var str = `populate=${f.field}`;
          if (f.select) {
            str += `&popField=${f.select}`;
          }
          temp.push(str);
        });
        queryArray.push(temp.join('&'));
      }
    }
    // console.log(queryArray);
    var option = {
      withCredentials: true,
      ...this.getHeaders(),
    };
    // console.log(option);
    const loadable = !['/health'].includes(endpoint);
    endpoint = localStorage.getItem('URL') + endpoint;
    var queryStr = queryArray.join('&') ? '?' + queryArray.join('&') : '';
    // console.log(endpoint + queryStr);
    switch (method) {
      case 'get': // get
        if (loadable) this.loadingSubject.next(true);
        return this.http.get<T>(endpoint + queryStr, option).pipe(
          finalize(() => {
            if (loadable) this.loadingSubject.next(false);
          })
        );

      case 'post': // insert
        return this.http.post<T>(endpoint, body, option);

      case 'put': // update all
        return this.http.put<T>(endpoint, body, option);

      case 'patch': // update some
        return this.http.patch<T>(endpoint, body, option);

      case 'delete': // delete
        return this.http.delete<T>(endpoint, option);

      default:
        return this.http.get<T>(endpoint, option);
    }
  }
}
