import { PROFESSOR_COLUMNS } from 'src/app/configs/columns';
import { SharedTableConfig } from 'src/app/models/table.interface';

export const PROFESSOR_TABLE_CONFIG: SharedTableConfig = {
  columns: PROFESSOR_COLUMNS,
  exportConfig: {
    fileName: 'PROFESSOR_TABLE',
    responsePath: 'professors',
    endpoint: 'professor/professors',
  },
};
