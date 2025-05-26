import Button from "../../../../../core/components/Button";
import { UserDetailsSectionInfoProps } from "../../../interfaces/AuthSettings";

export default function UserDetailsSectionInfo({
  title,
  info,
  nameButton = "Cambiar",
  onClick,
}: UserDetailsSectionInfoProps) {
  return (
    <article className="flex flex-col gap-3">
      <h4>{title}</h4>
      <div className="flex flex-row gap-1 items-center">
        <p>{info}</p>
        <Button onClick={onClick}>{nameButton}</Button>
      </div>
    </article>
  );
}
