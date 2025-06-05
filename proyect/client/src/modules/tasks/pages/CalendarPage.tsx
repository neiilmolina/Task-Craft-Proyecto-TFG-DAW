import { Calendar, dayjsLocalizer } from "react-big-calendar";
import DashboardPageLayout from "../../../core/layout/DashboardPageLayout";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";
import useTasksActions from "../hooks/useTasksActions";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import Button from "../../../core/components/Button";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

export default function CalendarPage() {
  const navigate = useNavigate();
  const { getTasks } = useTasksActions();
  const user = useSelector((state: RootState) => state.auth.user);
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [loading, setLoading] = useState(true);

  const localizer = dayjsLocalizer(dayjs);
  useEffect(() => {
    if (user) {
      setLoading(true);
      getTasks({ idUser: user.idUser }).finally(() => setLoading(false));
    }
  }, [user, getTasks]);

  if (!user) return <div>Necesitas iniciar sesión</div>;

  const onclick = () => navigate("/tasks/addTask");

  const events = tasks?.map((task) => {
    const startDate = dayjs(task.activityDate).toDate();
    return {
      title: task.title,
      start: startDate,
      end: startDate,
      id: task.idTask,
      color: task.type.color,
    };
  });

  const components = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event: (props: any) => {
      return (
        <div
          // style={{
          //   color: "black",
          //   backgroundColor: props.event.color,
          //   margin: 0,
          //   outline: "none",
          //   border: "none",
          //   padding: "5px",
          // }}
          onClick={() => navigate(`/tasks/detailsTask/${props.event.id}`)}
        >
          <p>{props.title}</p>
        </div>
      );
    },
  };

  return (
    <DashboardPageLayout title="Calendario" loading={loading}>
      <Button onClick={onclick} color="primary">
        Añadir tarea
      </Button>

      <Calendar
        localizer={localizer}
        startAccessor="start"
        events={events}
        views={["month"]}
        style={{
          height: "100vh",
          width: "100v%",
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
        components={components}
        messages={{
          month: "Mes",
          week: "Semana",
          day: "Día",
          today: "Hoy",
          previous: "Anterior",
          next: "Siguiente",
        }}
      />
    </DashboardPageLayout>
  );
}
