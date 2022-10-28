import { Section } from 'src/app/models/form.interface';

export const ROLE_FORM: Section[] = [
  {
    section: 'Role Details',
    show: false,
    items: [
      {
        label: 'Role Name',
        fcname: 'name',
        path: 'name',
        type: 'text',
        colspan: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
        show: true,
        appearance: 'outline',
      },
      {
        label: 'Description',
        fcname: 'description',
        path: 'description',
        type: 'text',
        colspan: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
        show: true,
        appearance: 'outline',
      },
    ],
  },
];
