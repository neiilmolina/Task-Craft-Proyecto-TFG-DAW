import { useEffect, useState } from "react";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import useTasksActions from "../../tasks/hooks/useTasksActions";
import AdminPageLayout from "../layouts/AdminPageLayout";

export default function TaskAdminPage() {
  const [loading, setLoading] = useState(true);
  const { getTasks } = useTasksActions();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  useEffect(() => {
    setLoading(true);
    getTasks({}).finally(() => setLoading(false));
  }, [getTasks]);

  const excludedKeys = ["state", "type"];
  const headers =
    tasks && tasks.length > 0
      ? Object.keys(tasks[0]).filter((key) => !excludedKeys.includes(key))
      : [];

  return (
    <AdminPageLayout
      list={tasks}
      navigationEditString="/tasks/detailsTask"
      navigationCreateString="/tasks/addTask"
      headers={headers}
      loading={loading}
    />
  );
}
