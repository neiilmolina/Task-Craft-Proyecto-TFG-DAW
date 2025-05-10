export interface ChangeScreen {
  text: string;
  href: string;
  action: string;
}

export type UserFormData = {
  username: string;
  email: string;
  password: string;
  password_confirm?: string;
};

export const INPUT_WIDTH = "w-full";
