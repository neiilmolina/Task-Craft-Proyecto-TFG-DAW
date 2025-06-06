import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { DiaryCreate, DiaryDTO, DiaryUpdate } from "task-craft-models";
import useDiariesActions from "../hooks/useDiariesActions";
import Spinner from "../../../core/components/Spinner";
import DiariesFormLayout from "../layouts/DiariesFormLayout";
import Button from "../../../core/components/Button";

export default function DiariesDetails() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? -1;

  const user = useSelector((state: RootState) => state.auth.user);
  const { getDiaryById, updateDiary, deleteDiary } = useDiariesActions();

  const [diary, setDiary] = useState<DiaryDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const navigator = useNavigate();

  const [formData, setFormData] = useState<DiaryCreate | DiaryUpdate>({
    activityDate: "",
    description: "",
    title: "",
    idUser: user?.idUser ?? "",
  });

  useEffect(() => {
    if (user && id) {
      getDiaryById(id).then((diaryDTO) => {
        setDiary(diaryDTO);
        console.log(diaryDTO);
        setLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, id]);

  const onSubmit = async (data: DiaryCreate | DiaryUpdate) => {
    const dataParse = data as DiaryUpdate;
    if (!id) return;
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas actualizar los campos de este diario?"
    );
    if (!confirmed) return;
    await updateDiary(id, dataParse);
    if (typeof redirectTo === "string") {
      navigator(redirectTo);
    } else {
      navigator(redirectTo);
    }
  };

  const onClickDelete = async () => {
    if (!id) return;
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este diario?"
    );
    if (!confirmed) return;
    await deleteDiary(id);
    console.log(redirectTo);
    if (typeof redirectTo === "string") {
      navigator(redirectTo);
    } else {
      navigator(redirectTo);
    }
  };

  if (loading) return <Spinner />;
  if (!diary) return <div>No se encontró el diario.</div>;
  return (
    <DiariesFormLayout
      action="update"
      formData={formData}
      setFormData={setFormData}
      initialData={diary}
      onSubmit={onSubmit}
    >
      <Button type="button" onClick={onClickDelete} color="error">
        Eliminar
      </Button>
      <Button>Editar</Button>
    </DiariesFormLayout>
  );
}
