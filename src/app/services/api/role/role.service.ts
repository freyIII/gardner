import { Inject, Injectable } from '@angular/core';
import { ApiResponse } from 'src/app/models/api.interface';
import { QueryParams } from 'src/app/models/queryparams.interface';
import { Role } from 'src/app/models/role.interface';
import { HttpService } from '../../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(@Inject(HttpService) private http: HttpService) {}
  createRole(body: Role) {
    return this.http.start<ApiResponse<Role>>('post', `/role`, body);
  }

  getAllRoles(query?: QueryParams) {
    return this.http.start<ApiResponse<Array<Role>>>('get', `/role`, {}, query);
  }

  updateRole(id: string, body: Role) {
    return this.http.start<ApiResponse<Role>>('put', `/role/${id}`, body);
  }

  deleteRole(id: string) {
    return this.http.start<ApiResponse<Role>>('delete', `/role/${id}`);
  }
}
