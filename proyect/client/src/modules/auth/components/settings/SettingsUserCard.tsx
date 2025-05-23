import Container from "../../../../core/components/Container";
import { SettingsUserCardsProps } from "../../interfaces/AuthSettings";

export default function SettingsUserCard({
  title,
  buttonColor = "primary",
  onClick,
  gridPosition,
  explication,
  className,
  ...rest
}: SettingsUserCardsProps) {
  <Container className={gridPosition + " " + className} {...rest}>
    <h4>{title}</h4>
    <p className="text-dark"></p>
    
  </Container>;
}
