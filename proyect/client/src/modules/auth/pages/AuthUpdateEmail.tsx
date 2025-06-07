import { useState } from "react";
import Input from "../../../core/components/Input";
import { TemplateAuthSettings } from "../layouts/TemplateAuthSettings";
import {
  checkAllEmptyFields,
  filterErrors,
} from "../../../core/hooks/validations";
import { FormattedError } from "task-craft-models";
import ErrorLabel from "../../../core/components/ErrorLabel";
import useAuthActions from "../hooks/useAuthActions";
import { validateEmail } from "task-craft-models";
import { useNavigate } from "react-router-dom";
export function AuthUpdateEmail() {
  const [formData, setFormData] = useState({
    email: "",
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

    if (formData.email !== formData.confirm_email) {
      setEmailErrors([
        {
          code: "emails_dont_match",
          message: "Los emails no coinciden",
          field: "email",
        },
      ]);
      return;
    }

    const validation = validateEmail(formData.email);

    if (!validation.success) {
      const errors = validation.errors;
      setEmailErrors(filterErrors(errors, "email"));
      return;
    }

    try {
      const confirmed = window.confirm(
        "¿Estás seguro de que deseas cambiar el email?"
      );
      if (!confirmed) return;
      await changeEmail(formData.email);
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
        placeholder="Nuevo email"
        id="email"
        name="email"
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
