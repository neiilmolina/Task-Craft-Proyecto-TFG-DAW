import { UserCreate } from "task-craft-models";

export interface ChangeScreen {
  text: string;
  href: string;
  action: string;
}

export interface UserFormData extends UserCreate  {
  password_confirm?: string;
};

export const INPUT_WIDTH = "w-full";
