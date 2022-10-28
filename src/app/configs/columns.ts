import { Column } from '../models/table.interface';

export const USER_COLUMNS: Array<Column> = [
  {
    title: 'Last Name',
    breakpoint: 'xs',
    path: 'lastName',
    type: 'text',
    selected: true,
  },
  {
    title: 'First Name',
    breakpoint: 'xs',
    path: 'firstName',
    type: 'text',
    selected: true,
  },
  {
    title: 'Middle Name',
    breakpoint: 'xs',
    path: 'middleName',
    type: 'text',
    selected: true,
  },
  {
    title: 'Email Address',
    breakpoint: 'xs',
    path: 'email',
    type: 'text',
    selected: true,
  },
  {
    title: 'Contact Number',
    breakpoint: 'xs',
    path: 'mobileNumber',
    type: 'text',
    selected: true,
  },
  {
    title: 'Type',
    breakpoint: 'xs',
    path: 'type',
    type: 'text',
    selected: true,
  },
  {
    title: 'Status',
    breakpoint: 'xs',
    path: 'status',
    type: 'text',
    selected: true,
  },
];

export const PROFESSOR_COLUMNS: Array<Column> = [
  {
    title: 'Last Name',
    breakpoint: 'xs',
    path: 'lastName',
    type: 'text',
    selected: true,
  },
  {
    title: 'First Name',
    breakpoint: 'xs',
    path: 'firstName',
    type: 'text',
    selected: true,
  },
  {
    title: 'Middle Name',
    breakpoint: 'xs',
    path: 'middleName',
    type: 'text',
    selected: true,
  },
  {
    title: 'Email Address',
    breakpoint: 'xs',
    path: 'email',
    type: 'text',
    selected: true,
  },
  {
    title: 'Contact Number',
    breakpoint: 'xs',
    path: 'mobileNumber',
    type: 'text',
    selected: true,
  },
  {
    title: 'Status',
    breakpoint: 'xs',
    path: 'status',
    type: 'text',
    selected: true,
  },
];

export const ROOM_COLUMNS: Array<Column> = [
  {
    title: 'Room Name',
    breakpoint: 'xs',
    path: 'name',
    type: 'text',
    selected: true,
  },
  {
    title: 'Room Type',
    breakpoint: 'xs',
    path: 'type',
    type: 'text',
    selected: true,
  },
  {
    title: 'Status',
    breakpoint: 'xs',
    path: 'status',
    type: 'text',
    selected: true,
  },
];

export const STRAND_COLUMNS: Array<Column> = [
  {
    title: 'Strand Name',
    breakpoint: 'xs',
    path: 'name',
    type: 'text',
    selected: true,
  },
  {
    title: 'Strand Code',
    breakpoint: 'xs',
    path: 'code',
    type: 'text',
    selected: true,
  },
];
export const SUBJECT_COLUMNS: Array<Column> = [
  {
    title: 'Subject Name',
    breakpoint: 'xs',
    path: 'name',
    type: 'text',
    selected: true,
  },
  {
    title: 'Subject Code',
    breakpoint: 'xs',
    path: 'code',
    type: 'text',
    selected: true,
  },
  {
    title: 'Description',
    breakpoint: 'xs',
    path: 'description',
    type: 'text',
    selected: true,
  },
  {
    title: 'Type',
    breakpoint: 'xs',
    path: 'type',
    type: 'text',
    selected: true,
  },
  {
    title: 'Year Level',
    breakpoint: 'xs',
    path: 'yearLevel',
    type: 'text',
    selected: true,
  },
  {
    title: 'Semester',
    breakpoint: 'xs',
    path: 'semester',
    type: 'text',
    selected: true,
  },
];

export const SCHEDULE_COLUMNS: Array<Column> = [
  {
    title: 'Name',
    breakpoint: 'xs',
    path: 'name',
    type: 'text',
    selected: true,
  },
  {
    title: 'Strand',
    breakpoint: 'xs',
    path: '_strand.name',
    type: 'idRef',
    selected: true,
  },
  {
    title: 'Room',
    breakpoint: 'xs',
    path: '_room.name',
    type: 'idRef',
    selected: true,
  },
  {
    title: 'Year Level',
    breakpoint: 'xs',
    path: 'yearLevel',
    type: 'text',
    selected: true,
  },
  {
    title: 'Semester',
    breakpoint: 'xs',
    path: 'semester',
    type: 'text',
    selected: true,
  },
];
