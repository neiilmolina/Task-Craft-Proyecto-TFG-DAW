import TemplateAuthForm from "../layouts/TemplateAuthForm";
import { ChangeScreen, INPUT_WIDTH } from "../interfaces/AuthFormInterfaces";
import Input from "../../../core/components/Input";

export default function Login() {
  const changeScreen: ChangeScreen = {
    text: "¿No tienes cuenta?",
    href: "/register",
    action: "Regístrate",
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Aquí puedes manejar el envío del formulario
    console.log("Formulario enviado");
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
      <form>
        <Input className={INPUT_WIDTH} placeholder="Email" id="email" />
        <Input
          className={INPUT_WIDTH}
          placeholder="Pon tu contraseña"
          id="password"
          type="password"
        />
      </form>
    </TemplateAuthForm>
  );
}
