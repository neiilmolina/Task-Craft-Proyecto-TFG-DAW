import { ReactNode } from "react";
import Button from "../../../core/components/Button";
import { useNavigate } from "react-router-dom";

interface TemplateAuthSettings {
  children: ReactNode;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function TemplateAuthSettings({
  children,
  onSubmit,
}: TemplateAuthSettings) {
  const navigator = useNavigate();

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-grey p-7">
      <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full max-w-md">
        {children}

        <div className="flex justify-around items-center mt-4">
          <Button
            type="button"
            color="error"
            onClick={() => {
              navigator(-1);
            }}
          >
            Cancelar
          </Button>

          <Button type="submit" color="primary">
            Confirmar
          </Button>
        </div>
      </form>
    </main>
  );
}
