import { ROOM_COLUMNS } from 'src/app/configs/columns';
import { SharedTableConfig } from 'src/app/models/table.interface';

export const ROOM_TABLE_CONFIG: SharedTableConfig = {
  columns: ROOM_COLUMNS,
  exportConfig: {
    fileName: 'ROOM_TABLE',
    responsePath: 'rooms',
    endpoint: 'room/rooms',
  },
};
