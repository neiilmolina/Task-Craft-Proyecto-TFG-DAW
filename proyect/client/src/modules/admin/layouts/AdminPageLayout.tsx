import { useNavigate } from "react-router-dom";
import Spinner from "../../../core/components/Spinner";
import AdminTable from "../components/AdminTable";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import Button from "../../../core/components/Button";

type AdminPageLayoutProps = {
  list: object[];
  navigationEditString: string;
  navigationCreateString: string;
  headers?: string[];
  loading: boolean;
};

export default function AdminPageLayout({
  list,
  navigationEditString,
  navigationCreateString,
  headers,
  loading,
}: AdminPageLayoutProps) {
  const navigate = useNavigate();
  const onClickEdit = async (id: string) => navigate(`${navigationEditString}/${id}?admin=true`);
  const onClickCreate = async () => navigate(`${navigationCreateString}?admin=true`);
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) return <div>Necesitas iniciar sesión</div>;

  if (loading) return <Spinner />;
  if (!list || list.length === 0) return <div>La lista está vacía</div>;

  return (
    <div>
      <Button className="mb-5" onClick={onClickCreate}>Añadir elemento</Button>
      <AdminTable list={list} onClick={onClickEdit} headers={headers} />
    </div>
  );
}
