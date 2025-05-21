import { TaskDTO } from "task-craft-models";
import Container from "../../../core/components/Container";
import { Temporal } from "@js-temporal/polyfill";
import { useNavigate } from "react-router-dom";

interface TaskCardProps {
  task: TaskDTO;
}

function TaskCard({ task }: TaskCardProps) {
  const { activityDate } = task;
  const navigate = useNavigate();
  const temporalDate = Temporal.PlainDateTime.from(activityDate);

  const dateTimeString =
    `${temporalDate.day.toString().padStart(2, "0")}/` +
    `${temporalDate.month.toString().padStart(2, "0")}/` +
    `${temporalDate.year}`;

  const hourString =
    `${temporalDate.hour.toString().padStart(2, "0")}:` +
    `${temporalDate.minute.toString().padStart(2, "0")}`;

  const now = Temporal.Now.plainDateTimeISO();
  const dateComparison = Temporal.PlainDateTime.compare(now, temporalDate);
  const lineThrough = dateComparison < 0 ? "line-through" : "";

  const onClick = () => navigate(`/tasks/detailsTask/${task.idTask}`);
  return (
    <Container
      role="button"
      tabIndex={0}
      className="
        w-40 h-32
        p-2
        rounded-lg
        cursor-pointer transition-colors
        duration-200 hover:bg-muted
      "
      onClick={onClick}
    >
      <h3
        className={`
          text-sm
          text-primary
          font-bold
          ${lineThrough}
          hover:underline
        `}
      >
        {task.title}
      </h3>

      <div
        className="
          flex
          mb-2
          items-center gap-1.5
        "
      >
        <span
          style={{ backgroundColor: task.type.color }}
          className="
            flex-shrink-0
            h-2 w-2
            rounded-full
          "
        />
        <span
          style={{ color: task.type.color }}
          className="
            text-xs font-medium
          "
        >
          {task.type.type}
        </span>
      </div>

      <div
        className="
          space-y-0.5
          text-xs
        "
      >
        <p>{dateTimeString}</p>
        <p>{hourString}</p>
      </div>
    </Container>
  );
}

export default TaskCard;
