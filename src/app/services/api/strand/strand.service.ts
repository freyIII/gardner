import { Inject, Injectable } from '@angular/core';
import { ApiResponse } from 'src/app/models/api.interface';
import { QueryParams } from 'src/app/models/queryparams.interface';
import { Strand } from 'src/app/models/strand.interface';
import { HttpService } from '../../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class StrandService {
  constructor(@Inject(HttpService) private http: HttpService) {}
  createStrand(body: Strand) {
    return this.http.start<ApiResponse<Strand>>('post', `/strand`, body);
  }

  getAllStrands(query: QueryParams) {
    return this.http.start<ApiResponse<Array<Strand>>>(
      'get',
      `/strand`,
      {},
      query
    );
  }

  updateStrand(id: string, body: Strand) {
    return this.http.start<ApiResponse<Strand>>('put', `/strand/${id}`, body);
  }

  deleteStrand(id: string) {
    return this.http.start<ApiResponse<Strand>>('delete', `/strand/${id}`);
  }
}
