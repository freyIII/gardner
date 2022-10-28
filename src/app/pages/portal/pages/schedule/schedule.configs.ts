import { SCHEDULE_COLUMNS } from 'src/app/configs/columns';
import { SharedTableConfig } from 'src/app/models/table.interface';

export const SCHEDULE_TABLE_CONFIG: SharedTableConfig = {
  columns: SCHEDULE_COLUMNS,
  exportConfig: {
    fileName: 'SCHEDULE_TABLE',
    responsePath: 'schedules',
    endpoint: 'room/schedule',
  },
};
