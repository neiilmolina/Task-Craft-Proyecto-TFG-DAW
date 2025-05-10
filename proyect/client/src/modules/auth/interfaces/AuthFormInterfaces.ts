export interface ChangeScreen {
  text: string;
  href: string;
  action: string;
}

export type UserFormData = {
  username: string;
  email: string;
  password: string;
  password_confirm?: string; // ahora es opcional
};

export const INPUT_WIDTH = "w-2/3";
