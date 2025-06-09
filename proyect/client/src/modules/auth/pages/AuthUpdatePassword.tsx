import { useState } from "react";
import PasswordInput from "../components/PasswordInput";
import { TemplateAuthSettings } from "../layouts/TemplateAuthSettings";
import {
  checkAllEmptyFields,
  filterErrors,
} from "../../../core/hooks/validations";
import { FormattedError, validatePassword } from "task-craft-models";
import ErrorLabel from "../../../core/components/ErrorLabel";
import useAuthActions from "../hooks/useAuthActions";
import { useNavigate } from "react-router-dom";

export default function AuthUpdatePassword() {
  const [formData, setFormData] = useState({
    actualPassword: "",
    newPassword: "",
    password_confirm: "",
  });
  const [passwordErrors, setPasswordErrors] = useState([] as FormattedError[]);
  const [serverErrors, setServerErrors] = useState([] as FormattedError[]);
  const { changePassword } = useAuthActions();
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

    if (formData.newPassword !== formData.password_confirm) {
      setPasswordErrors([
        {
          code: "passwords_dont_match",
          message: "Las contraseñas no coinciden",
          field: "password",
        },
      ]);
      return;
    }

    const validation = validatePassword(formData.newPassword);

    if (!validation.success) {
      const errors = validation.errors;
      setPasswordErrors(filterErrors(errors, "password"));
      return;
    }

    try {
      const confirmed = window.confirm(
        "¿Estás seguro de que deseas cambiar la contraseña de tu cuenta?"
      );
      if (!confirmed) return;
      await changePassword({
        newPassword: formData.newPassword,
        actualPassword: formData.actualPassword,
      });
      navigate(
        "/login?message=Contraseña actualizada correctamente, por favor inicia sesión de nuevo"
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
      <PasswordInput
        placeholder="Pon la contraseña actual"
        id="actualPassword"
        name="actualPassword"
        onChange={handleChange}
      />
      <PasswordInput
        placeholder="Pon la nueva contraseña"
        id="newPassword"
        name="newPassword"
        onChange={handleChange}
      />
      <PasswordInput
        placeholder="Confirmar contraseña"
        id="password_confirm"
        name="password_confirm"
        // required
        onChange={handleChange}
      />

      {passwordErrors.length > 0 &&
        passwordErrors.map(({ message }, index) => (
          <ErrorLabel key={index} text={message} />
        ))}

      {serverErrors.length > 0 &&
        serverErrors.map(({ message }, index) => (
          <ErrorLabel key={index} text={message} />
        ))}
    </TemplateAuthSettings>
  );
}
