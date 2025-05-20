import { ReactNode, useState } from "react";
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
  FormattedError,
  validateTaskCreate,
  validateTaskUpdate,
} from "task-craft-models";
import { useDateTime } from "../../../core/hooks/useDateTime";
import { filterErrors } from "../../../core/hooks/validations";
import ErrorLabel from "../../../core/components/ErrorLabel";

const INPUT_WIDTH = "w-full";

type TaskFormTemplateProps = {
  initialData?: TaskDTO;
  onSubmit: () => void;
  formData: TaskCreate | TaskUpdate;
  setFormData: React.Dispatch<React.SetStateAction<TaskCreate | TaskUpdate>>;
  action: "create" | "update" | "delete";
  children: ReactNode;
};

export default function TaskFormLayout({
  initialData,
  onSubmit,
  formData,
  setFormData,
  action,
  children,
}: TaskFormTemplateProps) {
  const [titleErrors, setTitleErrors] = useState([] as FormattedError[]);
  const [descriptionErrors, setDescriptionErrors] = useState(
    [] as FormattedError[]
  );
  const [idStateErrors, setIdStateErrors] = useState([] as FormattedError[]);
  const [idTypeErrors, setIdTypeErrors] = useState([] as FormattedError[]);
  const [activityDateErrors, setActivityDateErrors] = useState(
    [] as FormattedError[]
  );
  const [idUserErrors, setIdUserErrors] = useState([] as FormattedError[]);

  const [type, setType] = useState<Type | null>(
    initialData?.type
      ? {
          idType: initialData.type.idType,
          type: initialData.type.type,
          color: initialData.type.color,
          idUser: "",
        }
      : null
  );
  const [state, setState] = useState<State | null>(
    initialData?.state.idState
      ? { idState: initialData.state.idState, state: initialData.state.state }
      : null
  );

  const {
    date,
    time,
    setDate,
    setTime,
    datetime,
    handleDateChange,
    handleTimeChange,
  } = useDateTime();

  if (initialData?.activityDate) {
    const [initialDate, initialTime] = initialData.activityDate.split("T");
    setDate(initialDate);
    setTime(initialTime?.slice(0, 5) ?? "");
  }

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

    if (!formData) return;

    const newFormData = {
      ...formData,
      activityDate: datetime,
      idState: state?.idState ?? 0,
      idType: type?.idType ?? 0,
    };

    setFormData(newFormData);

    console.log(newFormData);

    let validate = null;
    if (action === "create") {
      validate = validateTaskCreate(newFormData);
    } else if (action === "update") {
      validate = validateTaskUpdate(newFormData);
    }

    if (validate !== null && !validate.success) {
      const errors = validate.errors;

      setTitleErrors(filterErrors(errors, "title"));
      setDescriptionErrors(filterErrors(errors, "description"));
      setActivityDateErrors(filterErrors(errors, "activityDate"));
      setIdStateErrors(filterErrors(errors, "idState"));
      setIdTypeErrors(filterErrors(errors, "idType"));
      setIdUserErrors(filterErrors(errors, "idUser"));
      return;
    }

    onSubmit();
  };

  return (
    <form
      className="flex flex-col gap-5 p-20 bg-grey items-center justify-center h-full"
      onSubmit={handleFormSubmit}
    >
      <div className="section-input-text">
        <label>Título</label>
        <Input
          className={INPUT_WIDTH}
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </div>
      {titleErrors.length > 0 &&
        titleErrors.map(({ message }, index) => (
          <ErrorLabel key={index} text={message} />
        ))}

      <div className="flex flex-row gap-2">
        <div className="section-input-datetime">
          <label>Fecha</label>
          <DatePicker value={date} onChange={handleDateChange} />
        </div>
        <div className="section-input-datetime">
          <label>Hora</label>
          <TimePickerTemporal value={time} onChange={handleTimeChange} />
        </div>
      </div>
      {activityDateErrors.length > 0 &&
        activityDateErrors.map(({ message }, index) => (
          <ErrorLabel key={index} text={message} />
        ))}

      <div className="section-input-text">
        <label>Descripción</label>
        <TextArea
          name="description"
          id="description"
          placeholder="Escribe una descripción..."
          value={formData.description}
          onChange={handleChange}
          className={INPUT_WIDTH}
        />
      </div>
      {descriptionErrors.length > 0 &&
        descriptionErrors.map(({ message }, index) => (
          <ErrorLabel key={index} text={message} />
        ))}

      <div className="section-input-select">
        <label>Categoría</label>
        <SelectTypes type={type} setType={setType} />
      </div>
      {idTypeErrors.length > 0 &&
        idTypeErrors.map(({ message }, index) => (
          <ErrorLabel key={index} text={message} />
        ))}

      <div className="section-input-select">
        <label>Estado</label>
        <SelectStates state={state} setState={setState} />
      </div>
      {idStateErrors.length > 0 &&
        idStateErrors.map(({ message }, index) => (
          <ErrorLabel key={index} text={message} />
        ))}

      {idUserErrors.length > 0 &&
        idUserErrors.map(({ message }, index) => (
          <ErrorLabel key={index} text={message} />
        ))}

      {children}
    </form>
  );
}
