// pages/Register.tsx
import TemplateAuthForm from "../layouts/TemplateAuthForm";
import Input from "../../../core/components/Input";
import { ChangeScreen, INPUT_WIDTH } from "../interfaces/AuthFormInterfaces";
import { useState } from "react";
import ErrorLabel from "../../../core/components/ErrorLabel";

export default function Register() {
  const changeScreen: ChangeScreen = {
    text: "¿Tienes cuenta?",
    href: "/login",
    action: "Inicia sesión",
  };

  const [errors, setErrors] = useState([] as string[]);

  const [formData, setFormData] = useState({
    username: "",
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

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formData.password !== formData.password_confirm) {
      setErrors(["Las contraseñas no coinciden"]);
      return;
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
          value={formData.username}
          onChange={handleChange}
        />
        <Input
          className={INPUT_WIDTH}
          placeholder="Email"
          id="email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          className={INPUT_WIDTH}
          placeholder="Pon tu contraseña"
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        <Input
          className={INPUT_WIDTH}
          placeholder="Confirmar contraseña"
          id="password_confirm"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />

        {errors.length > 0 &&
          errors.map((error) => <ErrorLabel text={error} />)}
      </>
    </TemplateAuthForm>
  );
}
