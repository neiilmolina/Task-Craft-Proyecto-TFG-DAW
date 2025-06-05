import { ReactNode, useEffect, useState } from "react";
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
  User,
} from "task-craft-models";
import { useDateTime } from "../../../core/hooks/useDateTime";
import { filterErrors } from "../../../core/hooks/validations";
import ErrorLabel from "../../../core/components/ErrorLabel";
import { isAllEmptyOrZero } from "../../../core/hooks/checkEmptyFields";
import Button from "../../../core/components/Button";
import { useNavigate } from "react-router-dom";
import { CharacterCounter } from "../../../core/components/CharacterCounter";
import useQueryParams from "../../../core/hooks/useQueryParams";
import { Temporal } from "@js-temporal/polyfill";
import useUsersActions from "../../users/hooks/useUsersActions";
import SearchableSelectUser from "../../users/components/SearchableSelectUser";

const INPUT_WIDTH = "w-full";

type TaskFormTemplateProps = {
  initialData?: TaskDTO;
  onSubmit: (data: TaskCreate | TaskUpdate) => Promise<void>;
  formData: TaskCreate | TaskUpdate;
  setFormData: React.Dispatch<React.SetStateAction<TaskCreate | TaskUpdate>>;
  action: "create" | "update";
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
  const { useBooleanQueryParam } = useQueryParams();
  const admin = useBooleanQueryParam("admin");
  const navigator = useNavigate();
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

  const [user, setUser] = useState<User | null>(null);
  const { getUserById } = useUsersActions();

  useEffect(() => {
    if (initialData?.idUser) {
      getUserById(initialData.idUser).then(setUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?.idUser]);

  useEffect(() => {
    if (initialData?.activityDate) {
      const [initialDate, initialTime] = initialData.activityDate.split("T");
      setDate(initialDate);
      setTime(initialTime?.slice(0, 5) ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  useEffect(() => {
    if (initialData && action === "update") {
      console.log("initial data", initialData);
      setFormData((prev) => ({
        ...prev,
        title: initialData.title,
        description: initialData.description,
        idState: initialData.state.idState,
        idType: initialData.type.idType,
        activityDate: initialData.activityDate,
        idUser: initialData.idUser,
      }));
    }
  }, [initialData, action, setFormData]);

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
      idUser: user?.idUser ?? initialData?.idUser ?? formData.idUser ?? "",
    };

    console.log("Submitting form data:", newFormData);
    setFormData(newFormData);

    let validate = null;

    if (action === "create") {
      if (isAllEmptyOrZero(newFormData, ["idUser"])) {
        alert("Para añadir la tarea tienes que rellenar algún campo");
        return;
      }
      validate = validateTaskCreate(newFormData);
    } else if (action === "update") {
      if (!initialData) return;

      const hasChanges =
        initialData.title !== newFormData.title
          ? true
          : initialData.description !== newFormData.description
          ? true
          : initialData.activityDate !== newFormData.activityDate
          ? true
          : initialData.state.idState !== newFormData.idState
          ? true
          : initialData.type.idType !== newFormData.idType
          ? true
          : initialData.idUser !== newFormData.idUser
          ? true
          : false;

      if (!hasChanges) {
        alert("Para actualizar la tarea tienes que cambiar algún campo");
        return;
      }

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

    if (initialData?.activityDate !== newFormData.activityDate) {
      const taskDate = Temporal.PlainDateTime.from(newFormData.activityDate);

      const now = Temporal.Now.plainDateTimeISO();

      const comparison = Temporal.PlainDateTime.compare(taskDate, now) < 0;
      // Use compare
      if (comparison) {
        setActivityDateErrors([
          {
            field: "activityDate",
            message: "La fecha debe ser en el futuro",
            code: "future_date",
          },
        ]);
        return;
      }
    }

    onSubmit(newFormData);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="
        flex flex-col
        w-full
        min-h-screen
        p-20
        bg-grey
        gap-5 items-center justify-center
        max-md:justify-start
      "
    >
      <div
        className="
          section-input-text
          max-mdfull
        "
      >
        <label>
          Título <CharacterCounter text={formData.title} maxLength={20} />
        </label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={INPUT_WIDTH}
          maxLength={20}
        />
      </div>
      {titleErrors.length > 0 &&
        titleErrors.map(({ message }, index) => (
          <ErrorLabel key={index} text={message} />
        ))}

      <div
        className="
          flex flex-row
          gap-2
          max-md:flex-start
        "
      >
        <div
          className="
            section-input-datetime
          "
        >
          <label>Fecha</label>
          <DatePicker value={date} onChange={handleDateChange} />
        </div>
        <div
          className="
            section-input-datetime
          "
        >
          <label>Hora</label>
          <TimePickerTemporal value={time} onChange={handleTimeChange} />
        </div>
      </div>
      {activityDateErrors.length > 0 &&
        activityDateErrors.map(({ message }, index) => (
          <ErrorLabel key={index} text={message} />
        ))}

      <div
        className="
          section-input-text
        "
      >
        <label>
          Descripción{" "}
          <CharacterCounter text={formData.description} maxLength={50} />
        </label>
        <TextArea
          name="description"
          id="description"
          placeholder="Escribe una descripción..."
          value={formData.description}
          maxLength={50}
          onChange={handleChange}
          className={INPUT_WIDTH + " h-36"}
        />
      </div>
      {descriptionErrors.length > 0 &&
        descriptionErrors.map(({ message }, index) => (
          <ErrorLabel key={index} text={message} />
        ))}

      <div
        className="
          section-input-select
        "
      >
        <label>Categoría</label>
        <SelectTypes type={type} setType={setType} />
      </div>
      {idTypeErrors.length > 0 && (
        <ErrorLabel text={"La categoría tiene que ser seleccionado"} />
      )}

      <div
        className="
          section-input-select
        "
      >
        <label>Estado</label>
        <SelectStates state={state} setState={setState} />
      </div>
      {idStateErrors.length > 0 && (
        <ErrorLabel text={"El estado tiene que ser seleccionado"} />
      )}

      {admin && (
        <div
          className="
          section-input-select
          max-mdfull
        "
        >
          <label>Usuario</label>
          <SearchableSelectUser user={user} setUser={setUser} />
        </div>
      )}
      {idUserErrors.length > 0 &&
        idUserErrors.map(({ message }, index) => (
          <ErrorLabel key={index} text={message} />
        ))}
      <div className="flex flex-row justify-between gap-10">
        <Button
          type="button"
          color="neutral"
          onClick={() => {
            navigator(-1);
          }}
        >
          Cancelar
        </Button>
        {children}
      </div>
    </form>
  );
}
