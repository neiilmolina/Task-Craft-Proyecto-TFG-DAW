import Button from "../../../../../core/components/Button";
import Container from "../../../../../core/components/Container";
import { SettingsUserCardsProps } from "../../../interfaces/AuthSettings";

export default function SettingsUserCard({
  title,
  buttonColor = "primary",
  onClick,
  explication,
  className,
  buttonName,
  ...rest
}: SettingsUserCardsProps) {
  return (
    <Container className={`flex flex-col gap-4 justify-center ${className}`} {...rest}>
      <h3>{title}</h3>
      <p className="text-greyDark">{explication}</p>
      <Button onClick={onClick} color={buttonColor}>
        {buttonName}
      </Button>
    </Container>
  );
}
