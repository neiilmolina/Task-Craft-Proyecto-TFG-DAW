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
  const hourString = `${temporalDate.hour}:${temporalDate.minute}${temporalDate.second}`;

  return (
    <Container>
      <a>{task.title}</a>
      <p>{task.type.type}</p>
      <p>{dateTimeString}</p>
      <p>{hourString}</p>
    </Container>
  );
}

export default TaskCard;
