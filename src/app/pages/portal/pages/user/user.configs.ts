import { USER_COLUMNS } from 'src/app/configs/columns';
import { SharedTableConfig } from 'src/app/models/table.interface';

export const USER_TABLE_CONFIG: SharedTableConfig = {
  columns: USER_COLUMNS,
  exportConfig: {
    fileName: 'USER_TABLE',
    responsePath: 'users',
    endpoint: 'user/users',
  },
};
