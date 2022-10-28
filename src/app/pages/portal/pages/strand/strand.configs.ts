import { STRAND_COLUMNS } from 'src/app/configs/columns';
import { SharedTableConfig } from 'src/app/models/table.interface';

export const STRAND_TABLE_CONFIG: SharedTableConfig = {
  columns: STRAND_COLUMNS,
  exportConfig: {
    fileName: 'STRAND_TABLE',
    responsePath: 'strands',
    endpoint: 'strand/strands',
  },
};
