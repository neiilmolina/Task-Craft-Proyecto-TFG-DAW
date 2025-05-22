import { useEffect, useState } from "react";
import DashboardPageLayout from "../../../core/layout/DashboardPageLayout";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import useDiariesActions from "../hooks/useDiariesActions";

export default function DiariesPage() {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);
  const diaries = useSelector((state: RootState) => state.diaries.diaries);
  const { getDiaries } = useDiariesActions();

  useEffect(() => {
    if (user) {
      setLoading(true);
    }
  }, [user, getDiaries]);
  return (
    <DashboardPageLayout title="Diarios" loading={loading}>
      hola
      {!diaries || diaries.length === 0 ? (
        <div>No hay diarios</div>
      ) : (
        diaries.map((diary) => {
          return diary.title;
        })
      )}
    </DashboardPageLayout>
  );
}
