import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../store";
import { DiaryCreate, DiaryUpdate } from "task-craft-models";
import { useState } from "react";
import DiariesFormLayout from "../layouts/DiariesFormLayout";
import Button from "../../../core/components/Button";
import useDiariesActions from "../hooks/useDiariesActions";

export default function DiariesAdd() {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigator = useNavigate();
  const { createDiary } = useDiariesActions(); 

  const [formData, setFormData] = useState<DiaryCreate | DiaryUpdate>({
    activityDate: "",
    description: "",
    title: "",
    idUser: user?.idUser ?? "",
  });

  const onSubmit = async (data: DiaryCreate | DiaryUpdate) => {
    const parseData = data as DiaryCreate;
    createDiary(parseData);
    navigator(-1);
  };
  return (
    <DiariesFormLayout
      action="create"
      formData={formData}
      setFormData={setFormData}
      onSubmit={onSubmit}
    >
      <Button>Añadir diario</Button>
    </DiariesFormLayout>
  );
}
