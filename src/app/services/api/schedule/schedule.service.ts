import { Inject, Injectable } from '@angular/core';
import { ApiResponse } from 'src/app/models/api.interface';
import { QueryParams } from 'src/app/models/queryparams.interface';
import { Schedule } from 'src/app/models/schedule.interface';
import { HttpService } from '../../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  constructor(@Inject(HttpService) private http: HttpService) {}
  createSchedule(body: Schedule) {
    return this.http.start<ApiResponse<Schedule>>('post', `/schedule`, body);
  }

  getAllSchedules(query?: QueryParams) {
    return this.http.start<ApiResponse<Array<Schedule>>>(
      'get',
      `/schedule`,
      {},
      query
    );
  }

  updateSchedule(id: string, body: Schedule) {
    return this.http.start<ApiResponse<Schedule>>(
      'put',
      `/schedule/${id}`,
      body
    );
  }

  deleteSchedule(id: string) {
    return this.http.start<ApiResponse<Schedule>>('delete', `/schedule/${id}`);
  }
}
