import { Inject, Injectable } from '@angular/core';
import { ApiResponse } from 'src/app/models/api.interface';
import { QueryParams } from 'src/app/models/queryparams.interface';
import { User } from 'src/app/models/user.interface';
import { HttpService } from '../../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(@Inject(HttpService) private http: HttpService) {}

  createUser(body: User) {
    return this.http.start<ApiResponse<User>>('post', `/user`, body);
  }

  getAllUsers(query: QueryParams) {
    return this.http.start<ApiResponse<Array<User>>>('get', `/user`, {}, query);
  }

  updateUser(id: string, body: User) {
    return this.http.start<ApiResponse<User>>('put', `/user/${id}`, body);
  }

  deleteUser(id: string) {
    return this.http.start<ApiResponse<User>>('delete', `/user/${id}`);
  }
}
