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
    <div className="flex flex-col gap-2 w-full">
      <p className="text-greyDark text-xl">{type.type}</p>
      <section className="flex flex-row gap-2 flex-wrap">
        {tasks.map((task) => (
          <TaskCard key={task.idTask} task={task} />
        ))}
      </section>
    </div>
  );
}
