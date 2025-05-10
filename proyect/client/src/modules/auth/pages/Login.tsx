import TemplateAuthForm from "../layouts/TemplateAuthForm";
import { ChangeScreen, INPUT_WIDTH } from "../interfaces/AuthFormInterfaces";
import Input from "../../../core/components/Input";
import { useState } from "react";
import useAuthActions from "../hooks/useAuthActions";

export default function Login() {
  const { login } = useAuthActions();

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

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login(formData);
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
        <Input
          className={INPUT_WIDTH}
          placeholder="Email"
          id="email"
          name="email"
          onChange={handleChange}
        />
        <Input
          className={INPUT_WIDTH}
          placeholder="Pon tu contraseña"
          id="password"
          name="password"
          type="password"
          onChange={handleChange}
        />
      </>
    </TemplateAuthForm>
  );
}
