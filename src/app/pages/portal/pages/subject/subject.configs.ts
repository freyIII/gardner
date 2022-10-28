import { SUBJECT_COLUMNS } from 'src/app/configs/columns';
import { SharedTableConfig } from 'src/app/models/table.interface';

export const SUBJECT_TABLE_CONFIG: SharedTableConfig = {
  columns: SUBJECT_COLUMNS,
  exportConfig: {
    fileName: 'SUBJECT_TABLE',
    responsePath: 'subjects',
    endpoint: 'subject/subjects',
  },
};
