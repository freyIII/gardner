import { Section } from 'src/app/models/form.interface';

export const ROOM_FORM: Section[] = [
  {
    section: 'Room Details',
    show: true,
    items: [
      {
        label: 'Room Name',
        fcname: 'name',
        path: 'name',
        type: 'text',
        colspan: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
        show: true,
        appearance: 'standard',
      },
      {
        label: 'Type',
        fcname: 'type',
        path: 'type',
        choices: ['Laboratory', 'Lecture'],
        type: 'select',
        colspan: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
        show: true,
        appearance: 'standard',
      },
    ],
  },
];
