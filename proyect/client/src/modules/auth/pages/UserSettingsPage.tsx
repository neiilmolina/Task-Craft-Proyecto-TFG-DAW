import { useSelector } from "react-redux";
import DashboardPageLayout from "../../../core/layout/DashboardPageLayout";
import { RootState } from "../../../store";
import SettingsUserCard from "../components/settings/cards/SettingsUserCard";
import UserDetailsSection from "../components/settings/sections/UserDetailsSection";

export default function UserSettingsPage() {
  const user = useSelector((state: RootState) => state.auth.user);

  const onClick = async () => {
    alert("Función no implementada");
  };

  return (
    <DashboardPageLayout title="Ajustes de Usuario">
      <div className="grid grid-cols-5 grid-rows-7 gap-4">
        <UserDetailsSection className="col-span-3 row-span-2 flex flex-col gap-3" />

        <SettingsUserCard
          key="logout"
          title="Cerrar Sesión"
          explication="Si deseas cerrar sesión, haz clic en el botón 'Cerrar sesión'. Esto te desconectará de forma segura y protegerá tu información, especialmente en dispositivos compartidos o públicos."
          buttonName="Cerrar sesión"
          buttonColor="error"
          className="col-span-3 row-span-2 col-start-1 row-start-3"
          onClick={onClick}
        />

        <SettingsUserCard
          key="change-password"
          title="Cambiar contraseña"
          explication="Para cambiar tu contraseña, haz clic en el botón 'Cambiar contraseña'. Sigue las instrucciones que aparecerán para actualizarla de manera rápida y segura."
          buttonName="Cambiar contraseña"
          className="col-span-2 row-span-2 col-start-4 row-start-1"
          onClick={onClick}
        />

        <SettingsUserCard
          key="delete-account"
          title="Eliminar Cuenta"
          explication="Si deseas eliminar tu cuenta, haz clic en el botón 'Eliminar cuenta'. Ten en cuenta que esta acción es permanente y no podrá deshacerse."
          buttonName="Eliminar Cuenta"
          buttonColor="error"
          className="col-span-2 row-span-2 col-start-4 row-start-3"
          onClick={onClick}
        />

        {Number(user?.role.idRole) === 2 && (
          <SettingsUserCard
            key="admin-panel"
            title="Parte de administración"
            explication="Como administrador, puedes gestionar las cuentas de los usuarios, modificar configuraciones globales y supervisar la actividad del sistema. Asegúrate de realizar estas acciones con precaución para mantener la seguridad e integridad de la plataforma."
            buttonName="Parte de administración"
            className="col-span-5 row-span-2 row-start-5"
            onClick={onClick}
          />
        )}
      </div>
    </DashboardPageLayout>
  );
}
