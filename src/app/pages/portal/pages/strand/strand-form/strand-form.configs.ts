import { Section } from 'src/app/models/form.interface';
import { AutocompleteApi } from 'src/app/shared/components/autocomplete-api/autocomplete-api.component';

export const STRAND_FORM: Section[] = [
  {
    section: 'Strand Details',
    show: true,
    items: [
      {
        label: 'Strand Name',
        fcname: 'name',
        path: 'name',
        type: 'text',
        colspan: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
        show: true,
        appearance: 'standard',
      },
      {
        label: 'Strand Code',
        fcname: 'code',
        path: 'code',
        type: 'text',
        colspan: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
        show: true,
        appearance: 'standard',
      },
    ],
  },
];

export const SUBJECT_AUTOCOMPLETE_CONFIG: AutocompleteApi = {
  query: {
    find: [
      {
        field: 'status',
        operator: '[ne]=',
        value: 'Deleted',
      },
    ],
    filterFields: ['name,code'],
    endpoint: '/subject',
    method: 'get',
    responsePath: 'subjects',
  },
  attributes: {
    label: 'name',
    displayedText: ['name'],
  },
  subtitles: [
    {
      icon: 'code',
      label: 'code',
    },
  ],
};
