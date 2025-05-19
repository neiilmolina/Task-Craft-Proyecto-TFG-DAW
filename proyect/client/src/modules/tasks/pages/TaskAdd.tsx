import { useState } from "react";
import Input from "../../../core/components/Input";
import { TaskCreate } from "task-craft-models";
import { TextArea } from "../../../core/components/Textarea";

const INPUT_WIDTH = "";

export default function TaskAdd() {
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

      <label>Descripción</label>
      <TextArea
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
      ></TextArea>
    </main>
  );
}
