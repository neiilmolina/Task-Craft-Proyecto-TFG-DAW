import { useSelector } from "react-redux";
import { RootState } from "../../../store";

export default function TasksPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <div>
      <h1>Tasks Pages</h1>
      <h2>{user?.userName}</h2>
    </div>
  );
}
