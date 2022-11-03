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
    hasAccess: true,
    subaccess: [
      {
        label: 'User',
        metadata: 'manage_accounts',
        route: 'user',
        hasAccess: true,
      },
      {
        label: 'Role',
        metadata: 'assignment_ind',
        route: 'role',
        hasAccess: true,
      },
      {
        label: 'Room',
        metadata: 'meeting_room',
        route: 'room',
        hasAccess: true,
      },
      {
        label: 'Strand',
        metadata: 'menu_book',
        route: 'strand',
        hasAccess: true,
      },
      {
        label: 'Subject',
        metadata: 'subject',
        route: 'subject',
        hasAccess: true,
      },
      {
        label: 'Professor',
        metadata: 'people',
        route: 'professor',
        hasAccess: true,
      },
      {
        label: 'Schedule',
        metadata: 'date_range',
        route: 'schedule',
        hasAccess: true,
      },
    ],
  },
];
