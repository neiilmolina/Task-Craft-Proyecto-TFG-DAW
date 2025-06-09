import { useState } from "react";
import Input from "../../../core/components/Input";
import { TemplateAuthSettings } from "../layouts/TemplateAuthSettings";
import {
  checkAllEmptyFields,
} from "../../../core/hooks/validations";
import { FormattedError } from "task-craft-models";
import ErrorLabel from "../../../core/components/ErrorLabel";
import useAuthActions from "../hooks/useAuthActions";
import { useNavigate } from "react-router-dom";

export default function AuthUpdateEmail() {
  const [formData, setFormData] = useState({
    actualEmail: "",
    newEmail: "",
    confirm_email: "",
  });
  const [emailErrors, setEmailErrors] = useState([] as FormattedError[]);
  const [serverErrors, setServerErrors] = useState([] as FormattedError[]);
  const { changeEmail } = useAuthActions();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (checkAllEmptyFields(formData)) {
      setServerErrors([
        {
          code: "empty_fields",
          message: "Por favor completa todos los campos",
          field: "server",
        },
      ]);
      return;
    }

    if (formData.newEmail !== formData.confirm_email) {
      setEmailErrors([
        {
          code: "emails_dont_match",
          message: "Los emails no coinciden",
          field: "email",
        },
      ]);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(formData.newEmail)) {
      setEmailErrors([
        {
          code: "invalid_email",
          message: "El email no tiene un formato válido",
          field: "email",
        },
      ]);
      return;
    }

    try {
      const confirmed = window.confirm(
        "¿Estás seguro de que deseas cambiar el email?"
      );
      if (!confirmed) return;
      await changeEmail({
        newEmail: formData.newEmail,
        actualEmail: formData.actualEmail,
      });
      navigate(
        "/login?message=Email actualizado correctamente, por favor inicia sesión con tu nuevo email."
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.isAxiosError) {
        setServerErrors([
          {
            code: "invalid_credentials",
            message: error.data?.error,
            field: "server",
          },
        ]);
      }
    }
  };
  return (
    <TemplateAuthSettings onSubmit={onSubmit}>
      <Input
        placeholder="Email actual"
        id="actualEmail"
        name="actualEmail"
        onChange={handleChange}
      />
      <Input
        placeholder="Nuevo email"
        id="newEmail"
        name="newEmail"
        onChange={handleChange}
      />
      <Input
        placeholder="confirmar nuevo email"
        id="confirm_email"
        name="confirm_email"
        onChange={handleChange}
      />
      {emailErrors.length > 0 &&
        emailErrors.map(({ message }, index) => (
          <ErrorLabel key={index} text={message} />
        ))}

      {serverErrors.length > 0 &&
        serverErrors.map(({ message }, index) => (
          <ErrorLabel key={index} text={message} />
        ))}
    </TemplateAuthSettings>
  );
}
