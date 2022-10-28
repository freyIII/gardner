export interface NavNode {
  label: string;
  metadata: string;
  route?: string;
  subaccess?: NavNode[];
  hasAccess: boolean;
  action?: string;
  css?: string;
  hidden?: boolean;
  disabled?: boolean;
  img?: string;
  badge?: string | number;
  subNodes?: NavNode[];
  header?: boolean;
}
