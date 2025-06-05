import { UserToken } from "task-craft-models";
import { ButtonColor } from "../../../core/interfaces/interfaceComponents";

export type UserDetailsSectionInfoProps = {
  title: string;
  nameButton?: string;
  info: string;
  onClick: () => Promise<void>;
};

export interface SettingsUserCardsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  className?: string;
  explication: string;
  buttonColor?: ButtonColor;
  buttonName?: string;
  onClick: () => Promise<void>;
}

export type RouteManagementProps = {
  children: JSX.Element;
  user: UserToken | null;
};