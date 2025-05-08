import Button from "../../../core/components/Button";
import Container from "../../../core/components/Container";
import Input from "../../../core/components/Input";
import SelectDialog from "../../../core/components/SelectDialog";

export default function DiariesPages() {
  return (
    <div>
      <h1>Diaries Pages</h1>
      <Button color="error">Hola</Button>
      <SelectDialog values={["1", "2", "3"]} onClose={() => {}}></SelectDialog>
      <Container>Hola</Container>
      <Input />
    </div>
  );
}
