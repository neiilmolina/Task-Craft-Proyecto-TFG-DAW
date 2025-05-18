import { Task } from "task-craft-models";
import Container from "../../../core/components/Container";

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  const { activityDate } = task;

  const dateTimeString = `${activityDate.day}/${activityDate.month}/${activityDate.year}`;
  const hourString = `${activityDate.hour}:${activityDate.minute}`;

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
