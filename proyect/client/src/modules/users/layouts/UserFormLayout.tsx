import { ReactNode, useEffect, useState } from "react";
import Input from "../../../core/components/Input";
import ErrorLabel from "../../../core/components/ErrorLabel";
import Button from "../../../core/components/Button";
import { useNavigate } from "react-router-dom";
import { CharacterCounter } from "../../../core/components/CharacterCounter";
import {
  User,
  UserCreate,
  UserUpdate,
  Role,
  FormattedError,
  validateUserCreate,
  validateUserUpdate,
} from "task-craft-models";
import SelectRoles from "../../roles/components/SelectRoles";
import { filterErrors } from "../../../core/hooks/validations";
import PasswordInput from "../../auth/components/PasswordInput";

type UserFormLayoutProps = {
  initialData?: User;
  onSubmit: (data: UserCreate | UserUpdate) => Promise<void>;
  formData: UserCreate | UserUpdate;
  setFormData: React.Dispatch<React.SetStateAction<UserCreate | UserUpdate>>;
  action: "create" | "update";
  children: ReactNode;
};

export default function UserFormLayout({
  initialData,
  onSubmit,
  formData,
  setFormData,
  action,
  children,
}: UserFormLayoutProps) {
  const navigator = useNavigate();

  const [userNameErrors, setUserNameErrors] = useState<FormattedError[]>([]);
  const [emailErrors, setEmailErrors] = useState<FormattedError[]>([]);
  const [passwordErrors, setPasswordErrors] = useState<FormattedError[]>([]);
  const [idRoleErrors, setIdRoleErrors] = useState<FormattedError[]>([]);
  const [serverErrors, setServerErrors] = useState<FormattedError[]>([]);

  const [role, setRole] = useState<Role | null>(
    initialData?.role
      ? { idRole: initialData.role.idRole, role: initialData.role.role }
      : null
  );

  useEffect(() => {
    if (initialData && action === "update") {
      setFormData({
        userName: initialData.userName ?? undefined,
        email: initialData.email,
        idRole: initialData.role.idRole,
      });

      if (initialData.urlImg) {
        setFormData((prev) => ({
          ...prev,
          urlImg: initialData.urlImg,
        }));
      }
    }
  }, [initialData, action, setFormData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData) return;

    const newFormData = {
      ...formData,
      idRole: role?.idRole ?? undefined,
    };

    setFormData(newFormData);

    let validateResult = null;

    if (action === "create") {
      validateResult = validateUserCreate(newFormData as UserCreate);
      console.log("Validation result for create:", validateResult);
    } else {
      validateResult = validateUserUpdate(newFormData as UserUpdate);
    }

    if (!validateResult.success) {
      const errors = validateResult.errors;
      setUserNameErrors(filterErrors(errors, "userName"));
      setEmailErrors(filterErrors(errors, "email"));
      setPasswordErrors(filterErrors(errors, "password"));
      setIdRoleErrors(filterErrors(errors, "idRole"));
      return;
    }

    try {
      await onSubmit(newFormData);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.isAxiosError) {
        setServerErrors([
          {
            code: "invalid_credentials",
            message: error.data?.error,
            field: "server",
          },
        ]);
      } else {
        setServerErrors([
          {
            code: "unknown_error",
            message: "Ha ocurrido un error desconocido",
            field: "server",
          },
        ]);
      }
    }
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
      <div className="section-input-text">
        <label>
          Nombre de usuario{" "}
          <CharacterCounter text={formData.userName ?? ""} maxLength={20} />
        </label>
        <Input
          id="userName"
          name="userName"
          value={formData.userName ?? ""}
          onChange={handleChange}
          className="w-full"
          maxLength={20}
        />
        {userNameErrors.map(({ message }, index) => (
          <ErrorLabel key={index} text={message} />
        ))}
      </div>

      <div className="section-input-text">
        <label>
          Email <CharacterCounter text={formData.email ?? ""} maxLength={40} />
        </label>
        <Input
          id="email"
          name="email"
          value={formData.email ?? ""}
          onChange={handleChange}
          className="w-full"
          maxLength={40}
        />
        {emailErrors.map(({ message }, index) => (
          <ErrorLabel key={index} text={message} />
        ))}
      </div>

      {action === "create" && (
        <div className="section-input-text">
          <label>Contraseña</label>
          <PasswordInput
            id="password"
            name="password"
            value={(formData as UserCreate).password ?? ""}
            onChange={handleChange}
            className="w-full"
          />
          {passwordErrors.map(({ message }, index) => (
            <ErrorLabel key={index} text={message} />
          ))}
        </div>
      )}

      <div className="section-input-select">
        <label>Rol</label>
        <SelectRoles role={role} setRole={setRole} />
        {idRoleErrors.length > 0 && (
          <ErrorLabel text="Se tiene que escoger un rol" />
        )}
      </div>

      {serverErrors.length > 0 &&
        serverErrors.map(({ message }, index) => (
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
