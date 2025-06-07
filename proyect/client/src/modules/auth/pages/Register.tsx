import TemplateAuthForm from "../layouts/TemplateAuthForm";
import Input from "../../../core/components/Input";
import {
  ChangeScreen,
  INPUT_WIDTH,
  UserFormData,
} from "../interfaces/AuthFormInterfaces";
import { useState } from "react";
import ErrorLabel from "../../../core/components/ErrorLabel";
import useAuthActions from "../hooks/useAuthActions";
import { validateUserCreate } from "task-craft-models";
import { FormattedError } from "task-craft-models";
import {
  checkAllEmptyFields,
  filterErrors,
} from "../../../core/hooks/validations";
import PasswordInput from "../components/PasswordInput";
import { useNavigate } from "react-router-dom";

export default function Register() {
  
  const navigate = useNavigate();
  const { register } = useAuthActions();
  const changeScreen: ChangeScreen = {
    text: "¿Tienes cuenta?",
    href: "/login",
    action: "Inicia sesión",
  };

  const [userNameErrors, setUserNameErrors] = useState([] as FormattedError[]);
  const [emailErrors, setEmailErrors] = useState([] as FormattedError[]);
  const [passwordErrors, setPasswordErrors] = useState([] as FormattedError[]);
  const [serverErrors, setServerErrors] = useState([] as FormattedError[]);

  const [formData, setFormData] = useState<UserFormData>({
    userName: "",
    email: "",
    password: "",
    password_confirm: "",
  });

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

    if (formData.password !== formData.password_confirm) {
      setPasswordErrors([
        {
          code: "passwords_dont_match",
          message: "Las contraseñas no coinciden",
          field: "password",
        },
      ]);
      return;
    }

    const userData = { ...formData };
    delete userData.password_confirm;

    const validationResult = validateUserCreate(userData);

    if (!validationResult.success) {
      const errors = validationResult.errors;
      setUserNameErrors(filterErrors(errors, "userName"));
      setEmailErrors(filterErrors(errors, "email"));
      setPasswordErrors(filterErrors(errors, "password"));
      return;
    }

    try {
      await register(userData);
      navigate("/login?message=Usuario Registrado");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.isAxiosError) {
        const status = error.status;
        const data = error.data;

        if (status === 409) {
          const errorMsg = data?.error || "Conflicto desconocido";

          setServerErrors([
            {
              code: "conflict",
              message: errorMsg,
              field: errorMsg.toLowerCase().includes("email")
                ? "email"
                : "server",
            },
          ]);
        } else {
          setServerErrors([
            {
              code: `server-${status}`,
              message: data?.error || `Error del servidor: ${status}`,
              field: "server",
            },
          ]);
        }
      } else {
        // Error no controlado
        setServerErrors([
          {
            code: "unknown",
            message: "Error desconocido",
            field: "server",
          },
        ]);
      }
    }
  };

  return (
    <TemplateAuthForm
      titlePage="Registro"
      titleForm="Bienvenido"
      messageForm="Create una cuenta para continuar"
      changeScreen={changeScreen}
      onSubmit={onSubmit}
      textButton="Regístrate"
    >
      <>
        <Input
          className={INPUT_WIDTH}
          placeholder="Nombre de Usuario"
          id="useName"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          // required
        />

        {userNameErrors.length > 0 &&
          userNameErrors.map(({ message }, index) => (
            <ErrorLabel key={index} text={message} />
          ))}

        <Input
          className={INPUT_WIDTH}
          placeholder="Email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          // required
        />

        {emailErrors.length > 0 &&
          emailErrors.map(({ message }, index) => (
            <ErrorLabel key={index} text={message} />
          ))}

        <PasswordInput
          className={INPUT_WIDTH}
          placeholder="Pon tu contraseña"
          id="password"
          name="password"
          value={formData.password}
          // required
          onChange={handleChange}
        />
        <PasswordInput
          className={INPUT_WIDTH}
          placeholder="Confirmar contraseña"
          id="password_confirm"
          name="password_confirm"
          value={formData.password_confirm}
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
      </>
    </TemplateAuthForm>
  );
}
