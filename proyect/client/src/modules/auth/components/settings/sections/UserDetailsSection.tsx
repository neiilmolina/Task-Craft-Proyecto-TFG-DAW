import { useSelector } from "react-redux";
import Button from "../../../../../core/components/Button";
import Container from "../../../../../core/components/Container";
import { RootState } from "../../../../../store";
import UserDetailsSectionInfo from "../cards/UserDetailsSectionInfo";
import { UserDetailsSectionInfoProps } from "../../../interfaces/AuthSettings";
import { useNavigate } from "react-router-dom";

interface UserDetailsSection extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export default function UserDetailsSection({
  className,
  ...rest
}: UserDetailsSection) {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  
  const onClick = async () => {
    alert("Opción no disponible");
  };

  const onClickChangeEmail = async () => {
    navigate("/auth/changeEmail");
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
      onClick: onClickChangeEmail,
    },
  ];
  return (
    <Container className={className} {...rest}>
      <header className="flex flex-col gap-3">
        <h3>Detalles del perfil</h3>
        <div className="flex flex-row gap-3 items-center">
          <span
            className="material-icons"
            style={{
              fontSize: "3rem",
            }}
          >
            account_circle
          </span>
          <Button className="">Subir foto de perfil</Button>
        </div>
      </header>
      <footer className="flex flex-row gap-3 w-[80%] justify-between max-md:flex-col ">
        {userDetailsSectionInfo.map((info) => {
          return (
            <UserDetailsSectionInfo
              key={info.title}
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
