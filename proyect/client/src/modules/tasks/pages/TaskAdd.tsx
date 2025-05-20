import { useState } from "react";
import Input from "../../../core/components/Input";
import { TaskCreate, Type, validateFutureDate } from "task-craft-models";
import { TextArea } from "../../../core/components/Textarea";
import DatePicker from "../../../core/components/DatePicker";
import TimePickerTemporal from "../../../core/components/TimePicker";
import { useDateTime } from "../../../core/hooks/useDateTime";
import SelectTypes from "../../types/components/SelectTypes";

const INPUT_WIDTH = "";

export default function TaskAdd() {
  const [type, setType] = useState<Type | null>(null);

  const { date, time, datetime, handleDateChange, handleTimeChange } =
    useDateTime();

  const [formData, setFormData] = useState<TaskCreate>({
    title: "",
    description: "",
    activityDate: "",
    idUser: "",
    idState: 1,
    idType: 1,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    validateFutureDate(datetime);
  };

  return (
    <form
      className="flex flex-col gap-4 p-20 bg-grey h-full"
      onSubmit={onSubmit}
    >
      <label>Titulo</label>
      <Input
        className={INPUT_WIDTH}
        placeholder=""
        id="title"
        name="title"
        value={formData.title}
        onChange={handleChange}
      />

      <div>
        <div>
          <label>Fecha</label>
          <DatePicker value={date} onChange={handleDateChange} />
        </div>
        <div>
          <label>Hora</label>
          <TimePickerTemporal value={time} onChange={handleTimeChange} />
        </div>
      </div>

      <div>
        <label>Categoría</label>
        <SelectTypes type={type} setType={setType} />
      </div>
      <label>Descripción</label>
      <TextArea
        name="description"
        id="description"
        placeholder="Escribe una descripción..."
        className={INPUT_WIDTH}
      />
    </form>
  );
}
