import { useEffect, useState } from "react";
import DashboardPageLayout from "../../../core/layout/DashboardPageLayout";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import useDiariesActions from "../hooks/useDiariesActions";
import DiaryCard from "../components/DiaryCard";
import Button from "../../../core/components/Button";
import { useNavigate } from "react-router-dom";

export default function DiariesPage() {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);
  const diaries = useSelector((state: RootState) => state.diaries.diaries);
  const { getDiaries } = useDiariesActions();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setLoading(true);
      getDiaries({ idUser: user.idUser }).finally(() => setLoading(false));
    }
  }, [user, getDiaries]);
  return (
    <DashboardPageLayout title="Diarios" loading={loading}>
      <Button onClick={() =>{navigate("/diaries/addDiary")}}>Añadir diario</Button>
      {!diaries || diaries.length === 0 ? (
        <div>No hay diarios</div>
      ) : (
        diaries.map((diary) => {
          return <DiaryCard key={diary.idDiary} diary={diary} />;
        })
      )}
    </DashboardPageLayout>
  );
}
