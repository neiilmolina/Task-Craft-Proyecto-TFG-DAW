import { useState } from "react";
import Input from "../../../core/components/Input";
import { TextArea } from "../../../core/components/Textarea";
import DatePicker from "../../../core/components/DatePicker";
import TimePickerTemporal from "../../../core/components/TimePicker";
import SelectTypes from "../../types/components/SelectTypes";
import SelectStates from "../../states/components/SelectStates";
import {
  TaskCreate,
  TaskUpdate,
  TaskDTO,
  Type,
  State,
} from "task-craft-models";
import { useDateTime } from "../../../core/hooks/useDateTime";

const INPUT_WIDTH = "w-full";

type TaskFormTemplateProps = {
  initialData?: TaskDTO;
  onSubmit: (data: TaskCreate | TaskUpdate) => void;
};

export default function TaskFormLayout({
  initialData,
  onSubmit,
}: TaskFormTemplateProps) {
  const [type, setType] = useState<Type | null>(
    initialData?.type
      ? {
          idType: initialData.type.idType,
          type: initialData.type.type,
          color: initialData.type.color,
          idUser: ""
        }
      : null
  );
  const [state, setState] = useState<State | null>(
    initialData?.state.idState
      ? { idState: initialData.state.idState, state: initialData.state.state }
      : null
  );

  const { date, time, datetime, handleDateChange, handleTimeChange } =
    useDateTime();

  const [formData, setFormData] = useState<TaskCreate>({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    activityDate: initialData?.activityDate ?? "",
    idUser: initialData?.idUser ?? "",
    idState: initialData?.state.idState ?? 1,
    idType: initialData?.type.idType ?? 1,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      activityDate: datetime,
      idType: type?.idType ?? formData.idType,
      idState: state?.idState ?? formData.idState,
    };
    onSubmit(dataToSubmit);
  };

  return (
    <form
      className="flex flex-col gap-4 p-20 bg-grey h-full"
      onSubmit={handleFormSubmit}
    >
      <label>Título</label>
      <Input
        className={INPUT_WIDTH}
        id="title"
        name="title"
        value={formData.title}
        onChange={handleChange}
      />

      <div className="flex flex-col gap-2">
        <label>Fecha</label>
        <DatePicker value={date} onChange={handleDateChange} />
        <label>Hora</label>
        <TimePickerTemporal value={time} onChange={handleTimeChange} />
      </div>

      <div className="flex flex-row">
        <label>Categoría</label>
        <SelectTypes type={type} setType={setType} />
      </div>

      <div className="flex flex-row">
        <label>Estado</label>
        <SelectStates state={state} setState={setState} />
      </div>

      <label>Descripción</label>
      <TextArea
        name="description"
        id="description"
        placeholder="Escribe una descripción..."
        value={formData.description}
        onChange={handleChange}
        className={INPUT_WIDTH}
      />

      <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">
        Guardar
      </button>
    </form>
  );
}
