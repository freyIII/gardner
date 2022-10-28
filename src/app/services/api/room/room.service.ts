import { Inject, Injectable } from '@angular/core';
import { ApiResponse } from 'src/app/models/api.interface';
import { QueryParams } from 'src/app/models/queryparams.interface';
import { Room } from 'src/app/models/room.interface';
import { HttpService } from '../../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(@Inject(HttpService) private http: HttpService) {}
  createRoom(body: Room) {
    return this.http.start<ApiResponse<Room>>('post', `/room`, body);
  }

  getAllRooms(query: QueryParams) {
    return this.http.start<ApiResponse<Array<Room>>>('get', `/room`, {}, query);
  }

  updateRoom(id: string, body: Room) {
    return this.http.start<ApiResponse<Room>>('put', `/room/${id}`, body);
  }

  updateRoomStatus(id: string, status: string) {
    return this.http.start<ApiResponse<Room>>('patch', `/room/${id}`, {
      status: status,
    });
  }
}
