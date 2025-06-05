import TemplateAuthForm from "../layouts/TemplateAuthForm";
import { ChangeScreen, INPUT_WIDTH } from "../interfaces/AuthFormInterfaces";
import Input from "../../../core/components/Input";
import { useState } from "react";
import useAuthActions from "../hooks/useAuthActions";
import useQueryParam from "../../../core/hooks/useQueryParam";
import { FormattedError } from "task-craft-models";
import ErrorLabel from "../../../core/components/ErrorLabel";
import { checkAllEmptyFields } from "../../../core/hooks/validations";
import PasswordInput from "../components/PasswordInput";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState([] as FormattedError[]);

  const { login, getAuthenticatedUser } = useAuthActions();
  const success = useQueryParam("message");

  const changeScreen: ChangeScreen = {
    text: "¿No tienes cuenta?",
    href: "/register",
    action: "Regístrate",
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
        setErrors([
          {
            code: "empty_fields",
            message: "Los campos no pueden estar vacíos",
            field: "client",
          },
        ]);
        return;
      }
      await login(formData);
      
      const result = await getAuthenticatedUser();
      console.log(result);
      navigate("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.isAxiosError) {
        setErrors([
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
    <TemplateAuthForm
      titlePage="Login"
      titleForm="Bienvenido"
      messageForm="Inicia sesión si tienes cuenta"
      changeScreen={changeScreen}
      textButton="Inicia Sesión"
      onSubmit={onSubmit}
    >
      <>
        {success && (
          <label className="text-correct font-bold">Usuario Registrado</label>
        )}
        <Input
          className={INPUT_WIDTH}
          placeholder="Email"
          id="email"
          name="email"
          onChange={handleChange}
        />
        <PasswordInput
          className={INPUT_WIDTH}
          placeholder="Pon tu contraseña"
          id="password"
          name="password"
          onChange={handleChange}
        />
        {errors.length > 0 &&
          errors.map(({ message }, index) => (
            <ErrorLabel key={index} text={message} />
          ))}
      </>
    </TemplateAuthForm>
  );
}
