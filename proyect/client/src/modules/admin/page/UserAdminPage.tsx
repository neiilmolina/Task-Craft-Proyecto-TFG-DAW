import { useEffect, useState } from "react";
import { RootState } from "../../../store";
import useUsersActions from "../../users/hooks/useUserAction";
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

  return (
    <AdminPageLayout
      list={users}
      navigationEditString="/users/detailsUser"
      navigationCreateString="/users/addUser"
      loading={loading}
    />
  );
}
