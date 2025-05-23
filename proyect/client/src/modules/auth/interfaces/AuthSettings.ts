export type UserDetailsSectionInfoProps = {
  title: string;
  nameButton?: string;
  info: string;
  onClick: () => Promise<void>;
};

export interface SettingsUserCardsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  gridPosition: string;
  className?: string;
  explication: string;
  buttonColor?: string;
  buttonName?: string;
  onClick: () => Promise<void>;
}
