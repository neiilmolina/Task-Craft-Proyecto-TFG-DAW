import { useState } from "react";
import Input from "../../../core/components/Input";
import { TemplateAuthSettings } from "../layouts/TemplateAuthSettings";
import {
  checkAllEmptyFields,
  filterErrors,
} from "../../../core/hooks/validations";
import { FormattedError, validateUserName } from "task-craft-models";
import ErrorLabel from "../../../core/components/ErrorLabel";
import useAuthActions from "../hooks/useAuthActions";
import { useNavigate } from "react-router-dom";

export default function AuthUpdateUserName() {
  const [formData, setFormData] = useState({
    actualUserName: "",
    newUserName: "",
    confirm_userName: "",
  });

  const [userNameErrors, setUserNameErrors] = useState([] as FormattedError[]);
  const [serverErrors, setServerErrors] = useState([] as FormattedError[]);
  const { changeUserName, getAuthenticatedUser } = useAuthActions();
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

    if (formData.newUserName !== formData.confirm_userName) {
      setUserNameErrors([
        {
          code: "userNames_dont_match",
          message: "Los userNames no coinciden",
          field: "userName",
        },
      ]);
      return;
    }

    const validation = validateUserName(formData.newUserName);

    if (!validation.success) {
      const errors = validation.errors;
      setUserNameErrors(filterErrors(errors, "userName,"));
      return;
    }

    try {
      const confirmed = window.confirm(
        "¿Estás seguro de que deseas cambiar el userName?"
      );
      if (!confirmed) return;
      await changeUserName({
        newUserName: formData.newUserName,
        actualUserName: formData.actualUserName,
      });

      await getAuthenticatedUser();
      navigate("/dashboard/userSettings");

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
        placeholder="Nombre de usuario actual"
        id="actualUserName"
        name="actualUserName"
        onChange={handleChange}
      />
      <Input
        placeholder="Nuevo nombre de usuario"
        id="newUserName"
        name="newUserName"
        onChange={handleChange}
      />
      <Input
        placeholder="Confirmar nombre de usuario"
        id="confirm_userName"
        name="confirm_userName"
        onChange={handleChange}
      />
      {userNameErrors.length > 0 &&
        userNameErrors.map(({ message }, index) => (
          <ErrorLabel key={index} text={message} />
        ))}

      {serverErrors.length > 0 &&
        serverErrors.map(({ message }, index) => (
          <ErrorLabel key={index} text={message} />
        ))}
    </TemplateAuthSettings>
  );
}
