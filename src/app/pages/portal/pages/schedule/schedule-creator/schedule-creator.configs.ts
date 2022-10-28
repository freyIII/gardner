import { AutocompleteApi } from 'src/app/shared/components/autocomplete-api/autocomplete-api.component';

export const ROOM_AUTOCOMPLETE_CONFIG: AutocompleteApi = {
  query: {
    find: [
      {
        field: 'status',
        operator: '[nin]=',
        value: 'Deleted,Inactive',
      },
    ],
    filterFields: ['name'],
    endpoint: '/room',
    method: 'get',
    responsePath: 'rooms',
  },
  attributes: {
    label: 'name',
  },
};

export const STRAND_AUTOCOMPLETE_CONFIG: AutocompleteApi = {
  query: {
    find: [
      {
        field: 'status',
        operator: '[ne]=',
        value: 'Deleted',
      },
    ],
    filterFields: ['name'],
    endpoint: '/strand',
    method: 'get',
    responsePath: 'strands',
  },
  attributes: {
    label: 'name',
  },
  subtitles: [
    {
      icon: 'code',
      label: 'code',
    },
  ],
};

export const SCHEDULE_AUTOCOMPLETE_CONFIG: AutocompleteApi = {
  query: {
    find: [
      {
        field: 'status',
        operator: '[ne]=',
        value: 'Deleted',
      },
    ],
    filterFields: ['name'],
    endpoint: '/schedule',
    method: 'get',
    responsePath: 'schedules',
  },
  attributes: {
    label: 'name',
  },
};

export const MORNING_TIMES = [
  '7:00 AM',
  '7:30 AM',
  '8:00 AM',
  '8:30 AM',
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
];

export const AFTERNOOON_TIMES = [
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 PM',
  '5:30 PM',
  '6:00 PM',
  '6:30 PM',
];
