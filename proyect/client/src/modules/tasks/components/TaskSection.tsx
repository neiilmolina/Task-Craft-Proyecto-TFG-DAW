import { TaskDTO } from "task-craft-models";
import TaskCard from "./TaskCard";

type TypeTask = {
  idType: number;
  type: string;
  color: string;
};

type TaskSectionsProps = {
  tasks: TaskDTO[];
  type: TypeTask;
};

export default function TaskSection({ tasks, type }: TaskSectionsProps) {
  return (
    <div>
      <p className="text-greyDark text-xl">{type.type}</p>
      {tasks.map((task) => (
        <TaskCard key={task.idTask} task={task} />
      ))}
    </div>
  );
}
