import { Inject, Injectable } from '@angular/core';
import { ApiResponse } from 'src/app/models/api.interface';
import { Professor } from 'src/app/models/professor.interface';
import { QueryParams } from 'src/app/models/queryparams.interface';
import { HttpService } from '../../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class ProfessorService {
  constructor(@Inject(HttpService) private http: HttpService) {}
  createProfessor(body: Professor) {
    return this.http.start<ApiResponse<Professor>>('post', `/professor`, body);
  }

  getAllProfessors(query: QueryParams) {
    return this.http.start<ApiResponse<Array<Professor>>>(
      'get',
      `/professor`,
      {},
      query
    );
  }

  updateProfessor(id: string, body: Professor) {
    return this.http.start<ApiResponse<Professor>>(
      'put',
      `/professor/${id}`,
      body
    );
  }

  deleteProfessor(id: string) {
    return this.http.start<ApiResponse<Professor>>(
      'delete',
      `/professor/${id}`
    );
  }
}
