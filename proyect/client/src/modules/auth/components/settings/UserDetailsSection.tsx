import { useSelector } from "react-redux";
import Button from "../../../../core/components/Button";
import Container from "../../../../core/components/Container";
import { RootState } from "../../../../store";
import UserDetailsSectionInfo from "./UserDetailsSectionInfo";
import { UserDetailsSectionInfoProps } from "../../interfaces/AuthSettings";

export default function UserDetailsSection() {
  const user = useSelector((state: RootState) => state.auth.user);
  const onClick = async () => {
    alert("Opción no disponible");
  };
  const userDetailsSectionInfo: UserDetailsSectionInfoProps[] = [
    {
      title: "Nombre de Usuario",
      info: user?.userName ?? "usuario",
      onClick: onClick,
    },
    {
      title: "Email",
      info: user?.email ?? "email",
      onClick: onClick,
    },
  ];
  return (
    <Container className="col-span-3 row-span-2 flex flex-col gap-3">
      <header className="flex flex-col gap-3">
        <h3>Detalles del perfil</h3>
        <div>
          <Button className="">Subir foto de perfil</Button>
        </div>
      </header>
      <footer className="flex flex-row gap-3 w-[80%] justify-between">
        {userDetailsSectionInfo.map((info) => {
          return (
            <UserDetailsSectionInfo
              info={info.info}
              onClick={info.onClick}
              title={info.title}
              nameButton={info?.nameButton}
            />
          );
        })}
      </footer>
    </Container>
  );
}
