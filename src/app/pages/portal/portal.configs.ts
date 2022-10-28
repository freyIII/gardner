import { NavNode } from 'src/app/models/treesidenav.interface';

export const USER_NAVS: NavNode[] = [
  {
    label: 'Dashboard',
    metadata: 'dashboard',
    route: 'dashboard',
    hasAccess: true,
  },
  {
    label: 'Management',
    metadata: '',
    hasAccess: false,
    subaccess: [
      {
        label: 'User',
        metadata: 'manage_accounts',
        route: 'user',
        hasAccess: false,
      },
      {
        label: 'Role',
        metadata: 'assignment_ind',
        route: 'role',
        hasAccess: false,
      },
      {
        label: 'Room',
        metadata: 'meeting_room',
        route: 'room',
        hasAccess: false,
      },
      {
        label: 'Strand',
        metadata: 'menu_book',
        route: 'strand',
        hasAccess: false,
      },
      {
        label: 'Subject',
        metadata: 'subject',
        route: 'subject',
        hasAccess: false,
      },
      {
        label: 'Professor',
        metadata: 'people',
        route: 'professor',
        hasAccess: false,
      },
      {
        label: 'Schedule',
        metadata: 'date_range',
        route: 'schedule',
        hasAccess: false,
      },
    ],
  },
];
