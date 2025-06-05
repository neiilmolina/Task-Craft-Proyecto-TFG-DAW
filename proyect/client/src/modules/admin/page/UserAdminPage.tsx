import { useEffect, useState } from "react";
import { RootState } from "../../../store";
import useUsersActions from "../../users/hooks/useUsersActions";
import { useSelector } from "react-redux";
import AdminPageLayout from "../layouts/AdminPageLayout";

export default function UserAdminPage() {
  const [loading, setLoading] = useState(true);
  const users = useSelector((state: RootState) => state.users.users);
  const { getUsers } = useUsersActions();

  useEffect(() => {
    setLoading(true);
    getUsers({}).finally(() => setLoading(false));
  }, [getUsers]);

  const excludedKeys = ["role"];

  const headers =
    users && users.length > 0
      ? Object.keys(users[0]).filter((key) => !excludedKeys.includes(key))
      : [];

  headers.push("role.role");

  return (
    <AdminPageLayout
      list={users}
      navigationEditString="/users/detailsUser"
      navigationCreateString="/users/addUser"
      loading={loading}
      headers={headers}
    />
  );
}
