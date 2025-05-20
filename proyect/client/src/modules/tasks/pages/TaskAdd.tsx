import { TaskCreate, } from "task-craft-models";
import TaskFormLayout from "../layouts/TaskFormLayout";

const INPUT_WIDTH = "";

export default function TaskAdd() {
  const handleSubmit = async (data: TaskCreate) => {
    // Validar y enviar al backend
    console.log("Tarea creada:", data);
  };

  return <TaskFormLayout onSubmit={() => handleSubmit(formData)} key={"ADd"} />;
}

// return (
//   <form
//     className="flex flex-col gap-4 p-20 bg-grey h-full"
//     onSubmit={onSubmit}
//   >
//     <label>Titulo</label>
//     <Input
//       className={INPUT_WIDTH}
//       placeholder=""
//       id="title"
//       name="title"
//       value={formData.title}
//       onChange={handleChange}
//     />

//     <div>
//       <div>
//         <label>Fecha</label>
//         <DatePicker value={date} onChange={handleDateChange} />
//       </div>
//       <div>
//         <label>Hora</label>
//         <TimePickerTemporal value={time} onChange={handleTimeChange} />
//       </div>
//     </div>

//     <div className="flex flex-row">
//       <label>Categoría</label>
//       <SelectTypes type={type} setType={setType} />
//     </div>
//     <div className="flex flex-row">
//       <label>Estado</label>
//       <SelectStates state={state} setState={setState} />
//     </div>
//     <label>Descripción</label>
//     <TextArea
//       name="description"
//       id="description"
//       placeholder="Escribe una descripción..."
//       className={INPUT_WIDTH}
//     />
//   </form>
// );
