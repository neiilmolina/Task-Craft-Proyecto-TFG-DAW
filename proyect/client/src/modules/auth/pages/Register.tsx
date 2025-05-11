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
import filterErrors from "../../../core/hooks/filterErrors";
import PasswordInput from "../components/PasswordInput";
import { AxiosError } from "axios";

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

    console.log("userData", userData);

    const validationResult = validateUserCreate(userData);

    if (!validationResult.success) {
      const errors = validationResult.errors;
      setUserNameErrors(filterErrors(errors, "username"));
      setEmailErrors(filterErrors(errors, "email"));
      setPasswordErrors(filterErrors(errors, "password"));
      return;
    }

    try {
      if (formData.userName === "") {
        formData.userName = null;
      }
      await register(userData);
      // navigate("/login?message=success");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const response = error.response;

        if (response?.status === 400 && Array.isArray(response.data?.details)) {
          const errors = response.data.details;
          setUserNameErrors(filterErrors(errors, "username"));
          setEmailErrors(filterErrors(errors, "email"));
          setPasswordErrors(filterErrors(errors, "password"));
          return;
        }

        if (
          response?.status === 409 &&
          typeof response.data?.error === "string"
        ) {
          setServerErrors([
            {
              code: "conflict",
              message: response.data.error,
              field: "server",
            },
          ]);
          return;
        }
      }

      setServerErrors([
        {
          code: "internal",
          message: "Error interno del servidor. Intenta más tarde.",
          field: "server",
        },
      ]);
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
          id="username"
          name="username"
          value={formData.userName ?? ""}
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
