import { ResultSetHeader } from "mysql2";
import mysql from "@/tests/__mocks__/mysql";
import { Task, TaskBD } from "@/src/tasks/model/interfaces/interfacesTasks";
import TaskMysqlDAO from "@/src/tasks/model/dao/TasksMysqlDAO";
import { Temporal } from "@js-temporal/polyfill";

jest.mock("mysql2", () => ({
  createConnection: mysql.createConnection,
}));

describe("TaskMysqlDAO", () => {
  let taskDAO: TaskMysqlDAO;
  beforeEach(() => {
    taskDAO = new TaskMysqlDAO();

    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("getAll", () => {
    const mockList: TaskBD[] = [
      {
        idTask: "1",
        title: "Task 1",
        description: "Description 1",
        activityDate: new Temporal.PlainDateTime(2023, 10, 1, 0, 0, 0),
        idState: 1,
        state: "Pending",
        idType: 1,
        type: "Type 1",
        color: "#FFFFFF",
        idUser: "user1",
      },
      {
        idTask: "2",
        title: "Task 2",
        description: "Description 2",
        activityDate: new Temporal.PlainDateTime(2023, 10, 1, 0, 0, 0),
        idState: 2,
        state: "In Progress",
        idType: 2,
        type: "Type 2",
        color: "#FFFFFF",
        idUser: "user2",
      },
    ];
  });
});
