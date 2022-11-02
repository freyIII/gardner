import { ROLE_COLUMNS } from 'src/app/configs/columns';
import { SharedTableConfig } from 'src/app/models/table.interface';

export const ROLE_TABLE_CONFIG: SharedTableConfig = {
  columns: ROLE_COLUMNS,
  exportConfig: {
    fileName: 'ROLE_TABLE',
    responsePath: 'roles',
    endpoint: 'role/rooms',
  },
};
