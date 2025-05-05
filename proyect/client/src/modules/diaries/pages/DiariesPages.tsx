import Button from "../../../core/components/Button";
import SelectDialog from "../../../core/components/SelectDialog";

export default function DiariesPages() {
  return (
    <>
      <h1>Diaries Pages</h1>
      <Button>Hola</Button>
      <SelectDialog
        values={["1", "2", "3"]}
        onClose={() => {}}
        
      ></SelectDialog>
    </>
  );
}
