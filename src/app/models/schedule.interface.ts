import { Professor } from './professor.interface';
import { Room } from './room.interface';
import { Strand } from './strand.interface';
import { Ordinal, Subject } from './subject.interface';
type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
type Shift = 'Morning' | 'Afternoon';

export interface Schedule {
  _id?: string;
  name: string;
  _room: any;
  _strand: any;
  yearLevel: Ordinal;
  semester: Ordinal;
  scheds: Array<Scheds>;

  // REF IDS
  _tenantId?: string;
  _createdBy?: string;
}

export interface Scheds {
  day: Day;
  shift: Shift;
  startTime: string;
  endTime: string;
  _professor: any;
  _subject: any;
}
