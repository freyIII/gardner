import { Section } from 'src/app/models/form.interface';
import { AutocompleteApi } from 'src/app/shared/components/autocomplete-api/autocomplete-api.component';

export const PROFESSOR_FORM: Section[] = [
  {
    section: 'Professor Details',
    show: true,
    items: [
      {
        label: 'First Name',
        fcname: 'firstName',
        path: 'firstName',
        type: 'text',
        colspan: { xs: 12, sm: 12, md: 6, lg: 6, xl: 6 },
        show: true,
        appearance: 'standard',
      },
      {
        label: 'Middle Name',
        fcname: 'middleName',
        path: 'middleName',
        type: 'text',
        colspan: { xs: 12, sm: 12, md: 6, lg: 6, xl: 6 },
        show: true,
        appearance: 'standard',
        optional: true,
      },
      {
        label: 'Last Name',
        fcname: 'lastName',
        path: 'lastName',
        type: 'text',
        colspan: { xs: 12, sm: 12, md: 6, lg: 6, xl: 6 },
        show: true,
        appearance: 'standard',
      },
      {
        label: 'Suffix',
        fcname: 'suffix',
        path: 'suffix',
        type: 'text',
        colspan: { xs: 12, sm: 12, md: 6, lg: 6, xl: 6 },
        show: true,
        appearance: 'standard',
        optional: true,
      },
      {
        label: 'Email',
        fcname: 'email',
        path: 'email',
        type: 'email',
        colspan: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
        show: true,
        appearance: 'standard',
      },
      {
        label: 'Mobile Number',
        fcname: 'mobileNumber',
        path: 'mobileNumber',
        type: 'mobileNumber',
        colspan: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
        show: true,
        appearance: 'standard',
      },
    ],
  },
];
