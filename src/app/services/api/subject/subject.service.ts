import { Inject, Injectable } from '@angular/core';
import { ApiResponse } from 'src/app/models/api.interface';
import { QueryParams } from 'src/app/models/queryparams.interface';
import { Subject } from 'src/app/models/subject.interface';
import { HttpService } from '../../http/http.service';
oninput;

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  constructor(@Inject(HttpService) private http: HttpService) {}

  createSubject(body: Subject) {
    return this.http.start<ApiResponse<Subject>>('post', `/subject`, body);
  }

  getAllSubjects(query: QueryParams) {
    return this.http.start<ApiResponse<Array<Subject>>>(
      'get',
      `/subject`,
      {},
      query
    );
  }

  updateSubject(id: string, body: Subject) {
    return this.http.start<ApiResponse<Subject>>('put', `/subject/${id}`, body);
  }

  deleteSubject(id: string) {
    return this.http.start<ApiResponse<Subject>>('delete', `/subject/${id}`);
  }
}
