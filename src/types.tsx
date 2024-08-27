import { User } from "./app/components/users/interface";

export type SideNavItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subMenuItems?: SideNavItem[];
};

export interface selectedUserState {
  selectedUser: undefined | any;
  setSelectedUser: (user: any) => void;
}
export interface userState {
  myUser: undefined | any;
  setUser: (user: any) => void;
  resetUser: () => void;
}
