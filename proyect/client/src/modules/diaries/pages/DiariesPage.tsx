import { useState } from "react";
import Button from "../../../core/components/Button";
import Container from "../../../core/components/Container";
import Input from "../../../core/components/Input";
import SelectTypes from "../../types/components/SelectTypes";
import { State, Type } from "task-craft-models";
import SelectStates from "../../states/components/SelectStates";

export default function DiariesPage() {
  const [type, setType] = useState<Type | null>(null);
  const [state, setState] = useState<State | null>(null);
  return (
    <div>
      <h1>Diaries Pages</h1>
      <Button color="error">Hola</Button>

      <SelectTypes classNameButton="" type={type} setType={setType} />
      <SelectStates classNameButton="" state={state} setState={setState} />
      <Container>Hola</Container>
      <Input />

      {type && (
        <div>
          <h2>Tipo seleccionado:</h2>
          <p>ID: {type.idType}</p>
          <p>Nombre: {type.type}</p>
        </div>
      )}
    </div>
  );
}
