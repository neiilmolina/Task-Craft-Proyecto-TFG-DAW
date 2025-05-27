import { useEffect, useState } from "react";
import { RootState } from "../../../store";
import useDiariesActions from "../../diaries/hooks/useDiariesActions";
import { useSelector } from "react-redux";
import AdminPageLayout from "../layouts/AdminPageLayout";

export default function DiaryAdminPage() {
  const [loading, setLoading] = useState(true);
  const diaries = useSelector((state: RootState) => state.diaries.diaries);
  const { getDiaries } = useDiariesActions();

  useEffect(() => {
    setLoading(true);
    getDiaries({}).finally(() => setLoading(false));
  }, [getDiaries]);

  return (
    <AdminPageLayout
      list={diaries}
      navigationEditString="/diaries/detailsDiary"
      navigationCreateString="/diaries/addDiary"
      loading={loading}
    />
  );
}
