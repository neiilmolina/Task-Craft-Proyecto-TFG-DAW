import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RootState } from "../../../store";
import { DiaryCreate, DiaryUpdate } from "task-craft-models";
import { useState } from "react";
import DiariesFormLayout from "../layouts/DiariesFormLayout";

export default function DiariesAdd() {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigator = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? -1;

  const [formData, setFormData] = useState<DiaryCreate | DiaryUpdate>({
    activityDate: "",
    description: "",
    title: "",
    idUser: user?.idUser ?? "",
  });

  const onSubmit = async (data: DiaryCreate | DiaryUpdate) => {
    const parseData = data as DiaryCreate;

    if (typeof redirectTo === "string") {
      navigator(redirectTo);
    } else {
      navigator(redirectTo);
    }
  };
  return (
    <DiariesFormLayout
      action="create"
      formData={formData}
      setFormData={setFormData}
      onSubmit={onSubmit}
    >
      Hola
    </DiariesFormLayout>
  );
}
