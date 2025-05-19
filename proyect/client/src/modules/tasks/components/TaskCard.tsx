import { TaskDTO } from "task-craft-models";
import Container from "../../../core/components/Container";
import { Temporal } from "@js-temporal/polyfill";

interface TaskCardProps {
  task: TaskDTO;
}

function TaskCard({ task }: TaskCardProps) {
  const { activityDate } = task;

  const temporalDate = Temporal.PlainDateTime.from(activityDate);
  console.log("temporalDate", temporalDate);

  const dateTimeString = `${temporalDate.day}/${temporalDate.month}/${temporalDate.year}`;
  const hourString = `${temporalDate.hour}:${temporalDate.minute}${temporalDate.second}`  ;

  return (
    <form>
      <button
        type="button"
        className="w-full text-left focus:outline-none rounded-lg"
      >
        <Container className="w-40 h-32 p-2 cursor-pointer transition-colors duration-200">
          <h3 className="text-sm text-primary hover:underline font-bold">
            {task.title}
          </h3>

          <div className="flex items-center gap-1.5 mb-2">
            <span
              className="h-2 w-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: task.type.color }}
            />
            <span
              className="text-xs font-medium"
              style={{ color: task.type.color }}
            >
              {task.type.type}
            </span>
          </div>

          <div className="text-xs space-y-0.5">
            <p>{dateTimeString}</p>
            <p>{hourString}</p>
          </div>
        </Container>
      </button>
    </form>
  );
}

export default TaskCard;
