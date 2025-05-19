import { useState } from "react";
import Input from "../../../core/components/Input";
import { TaskCreate } from "task-craft-models";
import { TextArea } from "../../../core/components/Textarea";
import { DatePicker } from "../../../core/components/DatePicker";
import { TimePickerTemporal } from "../../../core/components/TimePicker";

const INPUT_WIDTH = "";

export default function TaskAdd() {
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
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

  return (
    <main className="flex flex-col gap-4 p-20 bg-grey h-full">
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
          <DatePicker value={date} onChange={setDate} />
        </div>
        <div>
          <TimePickerTemporal value={time} onChange={setTime} />
        </div>
      </div>

      <label>Descripción</label>
      <TextArea
        name="description"
        id="description"
        placeholder="Escribe una descripción..."
        className={INPUT_WIDTH}
      />
    </main>
  );
}
