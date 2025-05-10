import { ReactNode } from "react";
import Button from "../../../core/components/Button";
import { Link } from "react-router-dom";
import { ChangeScreen } from "../interfaces/AuthFormInterfaces";

interface TemplateAuthFormProps {
  titlePage: string;
  titleForm: string;
  messageForm: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  changeScreen: ChangeScreen;
  textButton: string;
}

export default function TemplateAuthForm({
  titlePage,
  titleForm,
  messageForm,
  textButton,
  onSubmit,
  changeScreen,
  children,
}: TemplateAuthFormProps) {
  return (
    <div
      className="
        flex flex-col
        min-h-screen
        p-10
        bg-primary
        items-center
        h-full
      "
    >
      <h1>{titlePage}</h1>
      <div
        className="
          flex flex-col
          mt-6 p-14
          w-4/5
          bg-grey
          gap-12
          border-[1px] rounded-lg
          shadow-md justify-center
        "
      >
        <div
          className="
            flex flex-col
            items-start
            gap-2
            text-center
          "
        >
          <h2>{titleForm}</h2>
          <p>{messageForm}</p>
        </div>
        <form
          className="
            flex flex-col
            gap-8
            items-center
            justify-center
          "
          onSubmit={onSubmit}
        >
          {children}
          <Button type="submit">{textButton}</Button>
          <p>
            {changeScreen.text}{" "}
            <Link to={changeScreen.href}>{changeScreen.action}</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
