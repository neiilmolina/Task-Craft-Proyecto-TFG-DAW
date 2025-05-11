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
    m-0
    px-16
    bg-primary
    justify-center
    items-center
    max-sm:text-center
    max-lg:p-0
    max-md:p-0
    max-sm:p-10
    overflow-hidden
  "
    >
      <h1 className="mb-2.5">{titlePage}</h1>
      <div
        className="
          flex flex-col
          w-2/4 p-14
          bg-grey
          border-[1px] rounded-lg
          shadow-md
          gap-12 justify-center
          max-sm:w-full
        "
      >
        <div
          className="
            flex flex-col
            text-center
            items-start gap-2
          "
        >
          <h2>{titleForm}</h2>
          <p>{messageForm}</p>
        </div>
        <form
          onSubmit={onSubmit}
          className="
            flex flex-col
            gap-8 items-center justify-center
          "
        >
          {children}
          <Button type="submit">{textButton}</Button>
          <p>
            <span>{changeScreen.text} </span>
            <Link to={changeScreen.href}>{changeScreen.action}</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
