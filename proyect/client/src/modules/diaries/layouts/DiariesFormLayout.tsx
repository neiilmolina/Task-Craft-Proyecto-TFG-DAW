import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DiaryCreate,
  DiaryDTO,
  DiaryUpdate,
  FormattedError,
  validateDiaryCreate,
  validateDiaryUpdate,
} from "task-craft-models";
import { filterErrors } from "../../../core/hooks/validations";
import ErrorLabel from "../../../core/components/ErrorLabel";
import { Temporal } from "@js-temporal/polyfill";
import Button from "../../../core/components/Button";
import { isAllEmptyOrZero } from "../../../core/hooks/checkEmptyFields";
import { getDatePhraseFromTemporal } from "../../../core/hooks/dateConversions";
import useQueryParams from "../../../core/hooks/useQueryParams";
import { CharacterCounter } from "../../../core/components/CharacterCounter";
import Input from "../../../core/components/Input";

const INPUT_WIDTH = "w-full";

type DiariesFormTemplateProps = {
  initialData?: DiaryDTO;
  onSubmit: (data: DiaryCreate | DiaryUpdate) => Promise<void>;
  formData: DiaryCreate | DiaryUpdate;
  setFormData: React.Dispatch<React.SetStateAction<DiaryCreate | DiaryUpdate>>;
  action: "create" | "update";
  children: ReactNode;
};

export default function DiariesFormLayout({
  initialData,
  onSubmit,
  formData,
  setFormData,
  action,
  children,
}: DiariesFormTemplateProps) {
  const { useBooleanQueryParam } = useQueryParams();
  const admin = useBooleanQueryParam("admin");
  const navigator = useNavigate();
  const [idUserErrors, setIdUserErrors] = useState([] as FormattedError[]);
  const [titleErrors, setTitleErrors] = useState([] as FormattedError[]);
  const [descriptionErrors, setDescriptionErrors] = useState(
    [] as FormattedError[]
  );

  useEffect(() => {
    if (initialData && action === "update") {
      setFormData((prev) => ({
        ...prev,
        title: initialData.title,
        description: initialData.description,
        idUser: initialData.idUser,
      }));
    }
  }, [initialData, action, setFormData]);

  const nowDate = Temporal.Now.plainDateTimeISO();

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
      activityDate: initialData?.activityDate
        ? initialData.activityDate
        : nowDate.toString(),
    };

    setFormData(newFormData);

    let validate = null;

    if (action === "create") {
      if (isAllEmptyOrZero(newFormData, ["idUser"])) {
        alert("Para añadir el diario tienes que rellenar algún campo");
        return;
      }
      validate = validateDiaryCreate(newFormData);
    } else if (action === "update") {
      if (!initialData) return;

      const hasChanges =
        initialData.title !== newFormData.title
          ? true
          : initialData.description !== newFormData.description
          ? true
          : false;

      if (!hasChanges) {
        alert("Para actualizar el diario tienes que cambiar algún campo");
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { activityDate, ...formDataWithoutDate } = newFormData;
      validate = validateDiaryUpdate(formDataWithoutDate);
    }

    if (validate !== null && !validate.success) {
      const errors = validate.errors;

      setTitleErrors(filterErrors(errors, "title"));
      setDescriptionErrors(filterErrors(errors, "description"));
      setIdUserErrors(filterErrors(errors, "idUser"));
      return;
    }

    onSubmit(newFormData);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="
        flex flex-col
        min-h-screen
        p-20
        bg-grey
        gap-9 items-center justify-start
        relative
      "
    >
      <input
        placeholder="Añadir título..."
        type="text"
        id="title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        className={`${INPUT_WIDTH} font-bold text-3xl text-primary focus:outline-none focus:ring-0`}
        maxLength={20}
      />
      {titleErrors.length > 0 &&
        titleErrors.map(({ message }, index) => (
          <ErrorLabel key={index} text={message} />
        ))}

      {admin && (
        <div
          className="
          section-input-text
          max-mdfull
        "
        >
          <label>
            idUsuario <CharacterCounter text={formData.title} maxLength={20} />
          </label>
          <Input
            id="idUser"
            name="idUser"
            value={formData.idUser}
            onChange={handleChange}
            className={INPUT_WIDTH}
            maxLength={20}
          />
        </div>
      )}

      {idUserErrors.length > 0 &&
        idUserErrors.map(({ message }, index) => (
          <ErrorLabel key={index} text={message} />
        ))}

      <div className="flex flex-row items-center justify-start gap-4 w-full">
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

      <h2 className="text-greyDark items-center justify-start w-full">
        {getDatePhraseFromTemporal({
          date: Temporal.PlainDateTime.from(nowDate),
        })}
      </h2>

      {descriptionErrors.length > 0 &&
        descriptionErrors.map(({ message }, index) => (
          <ErrorLabel key={index} text={message} />
        ))}

      <textarea
        placeholder="Añadir descripción..."
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        className={`${INPUT_WIDTH} h-72 text-[16px] text-black focus:outline-none focus:ring-0`}
        maxLength={300}
      />
    </form>
  );
}
