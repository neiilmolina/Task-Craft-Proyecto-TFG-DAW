import { useEffect, useState } from "react";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import useTasksActions from "../../tasks/hooks/useTasksActions";
import AdminTable from "../components/AdminTable";
import Spinner from "../../../core/components/Spinner";

export default function TaskAdminPage() {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);
  const { getTasks } = useTasksActions();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  useEffect(() => {
    if (user) {
      setLoading(true);
      getTasks({}).finally(() => setLoading(false));
    }
  }, [user, getTasks]);

  if (!user) return <div>Necesitas iniciar sesión</div>;

  if (loading) return <Spinner />;

  return (
    <div>
      <AdminTable list={tasks} />
    </div>
  );
}
