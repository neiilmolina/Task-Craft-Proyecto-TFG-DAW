import { useState } from "react";
import Input from "../../../core/components/Input";
import { TemplateAuthSettings } from "../layouts/TemplateAuthSettings";
import { checkAllEmptyFields } from "../../../core/hooks/validations";
import { FormattedError } from "task-craft-models";
import ErrorLabel from "../../../core/components/ErrorLabel";
import useAuthActions from "../hooks/useAuthActions";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";

export default function AuthDeleteUser() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [serverErrors, setServerErrors] = useState([] as FormattedError[]);
  const { deleteAccount } = useAuthActions();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (checkAllEmptyFields(formData)) {
        setServerErrors([
          {
            code: "empty_fields",
            message: "Los campos no pueden estar vacíos",
            field: "client",
          },
        ]);
        return;
      }
      const confirmed = window.confirm(
        "¿Estás seguro de que quieres eliminar tu cuenta?"
      );
      if (!confirmed) return;
      await deleteAccount(formData);

      navigate("/dashboard");
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
        placeholder="Email"
        id="email"
        name="email"
        onChange={handleChange}
      />
      <PasswordInput
        placeholder="Pon tu contraseña"
        id="password"
        name="password"
        onChange={handleChange}
      />

      {serverErrors.length > 0 &&
        serverErrors.map(({ message }, index) => (
          <ErrorLabel key={index} text={message} />
        ))}
    </TemplateAuthSettings>
  );
}
