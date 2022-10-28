import { Inject, Injectable } from '@angular/core';
import { UserService } from './user/user.service';
import { HttpService } from '../http/http.service';
import { RoomService } from './room/room.service';
import { StrandService } from './strand/strand.service';
import { SubjectService } from './subject/subject.service';
import { ProfessorService } from './professor/professor.service';
import { ScheduleService } from './schedule/schedule.service';
import { RoleService } from './role/role.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  url = localStorage.getItem('URL');
  constructor(
    @Inject(HttpService) private http: HttpService,
    public user: UserService,
    public room: RoomService,
    public strand: StrandService,
    public subject: SubjectService,
    public professor: ProfessorService,
    public schedule: ScheduleService,
    public role: RoleService
  ) {}

  check() {
    return this.http.start('get', '/health');
  }
}
