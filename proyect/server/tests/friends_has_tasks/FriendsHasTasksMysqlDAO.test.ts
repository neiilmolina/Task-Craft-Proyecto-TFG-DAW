import mysql from "../__mocks__/mysql";
import FriendsHasTasksMysqlDAO from "@/src/friends_has_tasks/model/dao/FriendsHasTasksMysqlDAO";

import {
  FriendHasTasks,
  FriendHasTasksCreate,
  FriendHasTasksReturn,
  FriendHasTasksBD,
} from "task-craft-models";
import { buildTaskFromFields } from "@/src/core/buildTaskFromFields";

jest.mock("mysql2", () => ({
  createConnection: mysql.createConnection,
}));

describe("FriendsHasTasksMysqlDAO", () => {
  let friendsHasTasksDAO: FriendsHasTasksMysqlDAO;
  let mockConnection: any;

  beforeEach(() => {
    friendsHasTasksDAO = new FriendsHasTasksMysqlDAO();
    mockConnection = mysql.createConnection();
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("getAll", () => {
    const mockResultsList: FriendHasTasksBD[] = [
      {
        idFriendHasTask: "1",
        friendHasTaskRequestState: true,
        idUserCreator: "1",
        userNameCreator: "creator1",
        emailCreator: "creator1@email.com",
        urlImgCreator: "http://example.com/image1.jpg",
        idUserAssigned: "2",
        userNameAssigned: "assigned1",
        emailAssigned: "assigned1@email.com",
        urlImgAssigned: "http://example.com/image2.jpg",
        idTask: "101",
        title: "Task 1",
        description: "Description of task 1",
        activityDate: "2025-04-26 10:00:00",
        idState: 1,
        state: "Pending",
        idType: 2,
        type: "Urgent",
        color: "#FF0000",
      },
      {
        idFriendHasTask: "2",
        friendHasTaskRequestState: false,
        idUserCreator: "2",
        userNameCreator: "creator2",
        emailCreator: "creator2@email.com",
        urlImgCreator: "http://example.com/image3.jpg",
        idUserAssigned: "3",
        userNameAssigned: "assigned2",
        emailAssigned: "assigned2@email.com",
        urlImgAssigned: "http://example.com/image4.jpg",
        idTask: "102",
        title: "Task 2",
        description: "Description of task 2",
        activityDate: "2025-04-27 11:00:00",
        idState: 2,
        state: "In Progress",
        idType: 1,
        type: "Regular",
        color: "#00FF00",
      },
      {
        idFriendHasTask: "3",
        friendHasTaskRequestState: true,
        idUserCreator: "3",
        userNameCreator: "creator3",
        emailCreator: "creator3@email.com",
        urlImgCreator: "http://example.com/image5.jpg",
        idUserAssigned: "4",
        userNameAssigned: "assigned3",
        emailAssigned: "assigned3@email.com",
        urlImgAssigned: "http://example.com/image6.jpg",
        idTask: "103",
        title: "Task 3",
        description: "Description of task 3",
        activityDate: "2025-04-28 12:00:00",
        idState: 3,
        state: "Completed",
        idType: 3,
        type: "Low Priority",
        color: "#0000FF",
      },
      {
        idFriendHasTask: "4",
        friendHasTaskRequestState: false,
        idUserCreator: "4",
        userNameCreator: "creator4",
        emailCreator: "creator4@email.com",
        urlImgCreator: "http://example.com/image7.jpg",
        idUserAssigned: "5",
        userNameAssigned: "assigned4",
        emailAssigned: "assigned4@email.com",
        urlImgAssigned: "http://example.com/image8.jpg",
        idTask: "104",
        title: "Task 4",
        description: "Description of task 4",
        activityDate: "2025-04-29 13:00:00",
        idState: 4,
        state: "Archived",
        idType: 1,
        type: "Medium Priority",
        color: "#FFFF00",
      },
    ];

    it("should return an array of shared tasks when query is successful", async () => {
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[] | ((err: Error | null, results?: any[]) => void),
          callback?: (err: Error | null, results?: any[]) => void
        ) => {
          if (typeof params === "function") {
            params(null, mockResultsList);
          } else if (callback) {
            callback(null, mockResultsList);
          }
          return {} as any;
        }
      );

      const expectedResults: FriendHasTasks[] = mockResultsList.map((row) => ({
        idFriendHasTasks: row.idFriendHasTask,
        creatorUser: {
          idUser: row.idUserCreator,
          userName: row.userNameCreator,
          email: row.emailCreator,
          urlImg: row.urlImgCreator,
        },
        assignedUser: {
          idUser: row.idUserAssigned,
          userName: row.userNameAssigned,
          email: row.emailAssigned,
          urlImg: row.urlImgAssigned,
        },
        friendHasTaskRequestState: row.friendHasTaskRequestState,
        task: buildTaskFromFields({
          idTask: row.idTask,
          title: row.title,
          description: row.description,
          activityDate: row.activityDate,
          idState: row.idState,
          state: row.state,
          idType: row.idType,
          type: row.type,
          color: row.color,
          idUser: row.idUserCreator,
        }),
      }));

      const sharedTasks = await friendsHasTasksDAO.getAll({});

      expect(sharedTasks).toEqual(expectedResults);
      expect(mockConnection.query).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if query fails", async () => {
      const mockError = new Error("Database error");

      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[] | ((err: Error | null, results?: any[]) => void),
          callback?: (err: Error | null, results?: any[]) => void
        ) => {
          if (typeof params === "function") {
            params(mockError);
          } else if (callback) {
            callback(mockError);
          }
        }
      );

      await expect(friendsHasTasksDAO.getAll({})).rejects.toThrow(
        "Database error"
      );
    });

    it("should throw an error if results are not an array", async () => {
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[] | ((err: Error | null, results?: any[]) => void),
          callback?: (err: Error | null, results?: any[]) => void
        ) => {
          const fakeResults = { not: "an array" };
          if (typeof params === "function") {
            params(null, fakeResults as any);
          } else if (callback) {
            callback(null, fakeResults as any);
          }
        }
      );

      await expect(friendsHasTasksDAO.getAll({})).rejects.toThrow(
        "Expected array of results but got something else."
      );
    });

    it("should return an empty array if no shared tasks are found", async () => {
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[] | ((err: Error | null, results?: any[]) => void),
          callback?: (err: Error | null, results?: any[]) => void
        ) => {
          if (typeof params === "function") {
            params(null, []);
          } else if (callback) {
            callback(null, []);
          }
        }
      );

      const sharedTasks = await friendsHasTasksDAO.getAll({});
      expect(sharedTasks).toEqual([]);
    });

    it("should handle filtering friends by the idAssignedUser", async () => {
      const idUser = "1";

      const filteredResults = mockResultsList.filter(
        (row) => row.idUserAssigned === idUser
      );

      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[] | ((err: Error | null, results?: any[]) => void),
          callback?: (err: Error | null, results?: any[]) => void
        ) => {
          if (typeof params === "function") {
            params(null, filteredResults);
          } else if (callback) {
            expect(params).toContain(idUser); // Asegura que se pasa el parámetro
            callback(null, filteredResults);
          }
        }
      );

      const sharedTasks = await friendsHasTasksDAO.getAll({
        idAssignedUser: idUser,
      });

      const expectedResults: FriendHasTasks[] = filteredResults.map((row) => ({
        idFriendHasTasks: row.idFriendHasTask,
        creatorUser: {
          idUser: row.idUserCreator,
          userName: row.userNameCreator,
          email: row.emailCreator,
          urlImg: row.urlImgCreator,
        },
        assignedUser: {
          idUser: row.idUserAssigned,
          userName: row.userNameAssigned,
          email: row.emailAssigned,
          urlImg: row.urlImgAssigned,
        },
        friendHasTaskRequestState: row.friendHasTaskRequestState,
        task: buildTaskFromFields({
          idTask: row.idTask,
          title: row.title,
          description: row.description,
          activityDate: row.activityDate,
          idState: row.idState,
          state: row.state,
          idType: row.idType,
          type: row.type,
          color: row.color,
          idUser: row.idUserCreator,
        }),
      }));

      expect(sharedTasks).toEqual(expectedResults);
    });

    it("should handle filtering friends by the idUserCreator", async () => {
      const idUser = "2";

      const filteredResults = mockResultsList.filter(
        (row) => row.idUserCreator === idUser
      );

      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[] | ((err: Error | null, results?: any[]) => void),
          callback?: (err: Error | null, results?: any[]) => void
        ) => {
          if (typeof params === "function") {
            params(null, filteredResults);
          } else if (callback) {
            expect(params).toContain(idUser); // Asegura que se pasa el parámetro
            callback(null, filteredResults);
          }
        }
      );

      const sharedTasks = await friendsHasTasksDAO.getAll({
        idCreatorUser: idUser,
      });

      const expectedResults: FriendHasTasks[] = filteredResults.map((row) => ({
        idFriendHasTasks: row.idFriendHasTask,
        creatorUser: {
          idUser: row.idUserCreator,
          userName: row.userNameCreator,
          email: row.emailCreator,
          urlImg: row.urlImgCreator,
        },
        assignedUser: {
          idUser: row.idUserAssigned,
          userName: row.userNameAssigned,
          email: row.emailAssigned,
          urlImg: row.urlImgAssigned,
        },
        friendHasTaskRequestState: row.friendHasTaskRequestState,
        task: buildTaskFromFields({
          idTask: row.idTask,
          title: row.title,
          description: row.description,
          activityDate: row.activityDate,
          idState: row.idState,
          state: row.state,
          idType: row.idType,
          type: row.type,
          color: row.color,
          idUser: row.idUserCreator,
        }),
      }));

      expect(sharedTasks).toEqual(expectedResults);
    });
    it("should handle filtering friends by the both idUser", async () => {
      const idUser1 = "1";
      const idUser2 = "2";

      const filteredResults = mockResultsList.filter(
        (row) => row.idUserCreator === idUser1 && row.idUserAssigned === idUser2
      );

      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[] | ((err: Error | null, results?: any[]) => void),
          callback?: (err: Error | null, results?: any[]) => void
        ) => {
          if (typeof params === "function") {
            params(null, filteredResults);
          } else if (callback) {
            expect(params).toContain(idUser1);
            expect(params).toContain(idUser2);
            callback(null, filteredResults);
          }
        }
      );

      const sharedTasks = await friendsHasTasksDAO.getAll({
        idCreatorUser: idUser1,
        idAssignedUser: idUser2,
      });

      const expectedResults: FriendHasTasks[] = filteredResults.map((row) => ({
        idFriendHasTasks: row.idFriendHasTask,
        creatorUser: {
          idUser: row.idUserCreator,
          userName: row.userNameCreator,
          email: row.emailCreator,
          urlImg: row.urlImgCreator,
        },
        assignedUser: {
          idUser: row.idUserAssigned,
          userName: row.userNameAssigned,
          email: row.emailAssigned,
          urlImg: row.urlImgAssigned,
        },
        friendHasTaskRequestState: row.friendHasTaskRequestState,
        task: buildTaskFromFields({
          idTask: row.idTask,
          title: row.title,
          description: row.description,
          activityDate: row.activityDate,
          idState: row.idState,
          state: row.state,
          idType: row.idType,
          type: row.type,
          color: row.color,
          idUser: row.idUserCreator,
        }),
      }));

      expect(sharedTasks).toEqual(expectedResults);
    });
    it("should handle filtering by friendHasTaskRequestState = true", async () => {
      const filteredResults = mockResultsList.filter(
        (row) => row.friendHasTaskRequestState === true
      );

      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[] | ((err: Error | null, results?: any[]) => void),
          callback?: (err: Error | null, results?: any[]) => void
        ) => {
          if (typeof params === "function") {
            params(null, filteredResults);
          } else if (callback) {
            callback(null, filteredResults);
          }
        }
      );

      const sharedTasks = await friendsHasTasksDAO.getAll({
        friendHasTaskRequestState: true,
      });

      const expectedResults: FriendHasTasks[] = filteredResults.map((row) => ({
        idFriendHasTasks: row.idFriendHasTask,
        creatorUser: {
          idUser: row.idUserCreator,
          userName: row.userNameCreator,
          email: row.emailCreator,
          urlImg: row.urlImgCreator,
        },
        assignedUser: {
          idUser: row.idUserAssigned,
          userName: row.userNameAssigned,
          email: row.emailAssigned,
          urlImg: row.urlImgAssigned,
        },
        friendHasTaskRequestState: row.friendHasTaskRequestState,
        task: buildTaskFromFields({
          idTask: row.idTask,
          title: row.title,
          description: row.description,
          activityDate: row.activityDate,
          idState: row.idState,
          state: row.state,
          idType: row.idType,
          type: row.type,
          color: row.color,
          idUser: row.idUserCreator,
        }),
      }));

      expect(sharedTasks).toEqual(expectedResults);
    });

    it("should handle filtering by friendHasTaskRequestState = false", async () => {
      const filteredResults = mockResultsList.filter(
        (row) => row.friendHasTaskRequestState === false
      );

      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[] | ((err: Error | null, results?: any[]) => void),
          callback?: (err: Error | null, results?: any[]) => void
        ) => {
          if (typeof params === "function") {
            params(null, filteredResults);
          } else if (callback) {
            callback(null, filteredResults);
          }
        }
      );

      const sharedTasks = await friendsHasTasksDAO.getAll({
        friendHasTaskRequestState: false,
      });

      const expectedResults: FriendHasTasks[] = filteredResults.map((row) => ({
        idFriendHasTasks: row.idFriendHasTask,
        creatorUser: {
          idUser: row.idUserCreator,
          userName: row.userNameCreator,
          email: row.emailCreator,
          urlImg: row.urlImgCreator,
        },
        assignedUser: {
          idUser: row.idUserAssigned,
          userName: row.userNameAssigned,
          email: row.emailAssigned,
          urlImg: row.urlImgAssigned,
        },
        friendHasTaskRequestState: row.friendHasTaskRequestState,
        task: buildTaskFromFields({
          idTask: row.idTask,
          title: row.title,
          description: row.description,
          activityDate: row.activityDate,
          idState: row.idState,
          state: row.state,
          idType: row.idType,
          type: row.type,
          color: row.color,
          idUser: row.idUserCreator,
        }),
      }));

      expect(sharedTasks).toEqual(expectedResults);
    });

    it("should handle filtering friends when idUserAssigned and idUserCreator are the same (OR logic)", async () => {
      const idUser = "1";

      // Simula que el usuario aparece como firstUser o secondUser
      const filteredResults = mockResultsList.filter(
        (row) => row.idUserAssigned === idUser || row.idUserCreator === idUser
      );

      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[] | ((err: Error | null, results?: any[]) => void),
          callback?: (err: Error | null, results?: any[]) => void
        ) => {
          if (typeof params === "function") {
            params(null, filteredResults);
          } else if (callback) {
            // Verifica que los parámetros sean los dos mismos ID
            expect(params).toEqual([idUser, idUser]); // Aquí aseguramos que se pase el mismo ID
            callback(null, filteredResults);
          }
        }
      );

      const sharedTasks = await friendsHasTasksDAO.getAll({
        idAssignedUser: idUser,
        idCreatorUser: idUser,
      });

      const expectedResults: FriendHasTasks[] = filteredResults.map((row) => ({
        idFriendHasTasks: row.idFriendHasTask,
        creatorUser: {
          idUser: row.idUserCreator,
          userName: row.userNameCreator,
          email: row.emailCreator,
          urlImg: row.urlImgCreator,
        },
        assignedUser: {
          idUser: row.idUserAssigned,
          userName: row.userNameAssigned,
          email: row.emailAssigned,
          urlImg: row.urlImgAssigned,
        },
        friendHasTaskRequestState: row.friendHasTaskRequestState,
        task: buildTaskFromFields({
          idTask: row.idTask,
          title: row.title,
          description: row.description,
          activityDate: row.activityDate,
          idState: row.idState,
          state: row.state,
          idType: row.idType,
          type: row.type,
          color: row.color,
          idUser: row.idUserCreator,
        }),
      }));

      expect(sharedTasks).toEqual(expectedResults);
    });
  });

  describe("getById", () => {
    const mockSharedTask: FriendHasTasksBD = {
      idFriendHasTask: "1",
      friendHasTaskRequestState: true,
      idUserCreator: "1",
      userNameCreator: "creator1",
      emailCreator: "creator1@email.com",
      urlImgCreator: "http://example.com/image1.jpg",
      idUserAssigned: "2",
      userNameAssigned: "assigned1",
      emailAssigned: "assigned1@email.com",
      urlImgAssigned: "http://example.com/image2.jpg",
      idTask: "101",
      title: "Task 1",
      description: "Description of task 1",
      activityDate: "2025-04-26 10:00:00",
      idState: 1,
      state: "Pending",
      idType: 2,
      type: "Urgent",
      color: "#FF0000",
    };

    it("should return a friend when a valid ID is provided", async () => {
      const idSharedTask = "1";
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[] | ((err: Error | null, results?: any[]) => void),
          callback?: (err: Error | null, results?: any[]) => void
        ) => {
          if (typeof params === "function") {
            params(null, [mockSharedTask]);
          } else if (callback) {
            callback(null, [mockSharedTask]);
          }
        }
      );

      const sharedTasks = await friendsHasTasksDAO.getById(idSharedTask);

      expect(sharedTasks).toEqual({
        idFriendHasTasks: mockSharedTask.idFriendHasTask,
        creatorUser: {
          idUser: mockSharedTask.idUserCreator,
          userName: mockSharedTask.userNameCreator,
          email: mockSharedTask.emailCreator,
          urlImg: mockSharedTask.urlImgCreator,
        },
        assignedUser: {
          idUser: mockSharedTask.idUserAssigned,
          userName: mockSharedTask.userNameAssigned,
          email: mockSharedTask.emailAssigned,
          urlImg: mockSharedTask.urlImgAssigned,
        },
        friendHasTaskRequestState: mockSharedTask.friendHasTaskRequestState,
        task: buildTaskFromFields({
          idTask: mockSharedTask.idTask,
          title: mockSharedTask.title,
          description: mockSharedTask.description,
          activityDate: mockSharedTask.activityDate,
          idState: mockSharedTask.idState,
          state: mockSharedTask.state,
          idType: mockSharedTask.idType,
          type: mockSharedTask.type,
          color: mockSharedTask.color,
          idUser: mockSharedTask.idUserCreator,
        }),
      });

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining("WHERE"),
        [idSharedTask],
        expect.any(Function)
      );
    });

    it("should return null when no friend is found", async () => {
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[] | ((err: Error | null, results?: any[]) => void),
          callback?: (err: Error | null, results?: any[]) => void
        ) => {
          if (typeof params === "function") {
            params(null, []);
          } else if (callback) {
            callback(null, []);
          }
        }
      );

      const result = await friendsHasTasksDAO.getById("not-found-id");
      expect(result).toBeNull();
    });

    it("should throw an error if database query fails", async () => {
      const dbError = new Error("Query failed");

      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[] | ((err: Error | null, results?: any[]) => void),
          callback?: (err: Error | null, results?: any[]) => void
        ) => {
          if (typeof params === "function") {
            params(dbError);
          } else if (callback) {
            callback(dbError);
          }
        }
      );

      await expect(friendsHasTasksDAO.getById("not-found-id")).rejects.toThrow(
        "Query failed"
      );
    });
  });

  describe("FriendsHasTasksMysqlDAO - create", () => {
    const idFriendHasTasks = "f1";
    const sharedTasksInput: FriendHasTasksCreate = {
      idTask: "task-1",
      idAssignedUser: "user-456",
      friendHasTaskRequestState: false,
    };

    const expectedReturn: FriendHasTasksReturn = {
      idFriendHasTasks: idFriendHasTasks,
      idTask: sharedTasksInput.idTask,
      idAssignedUser: sharedTasksInput.idAssignedUser,
      friendHasTaskRequestState: sharedTasksInput.friendHasTaskRequestState,
    };

    it("should successfully create a new friend", async () => {
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[],
          callback: (err: Error | null, results?: any) => void
        ) => {
          callback(null, { affectedRows: 1 });
        }
      );

      const result = await friendsHasTasksDAO.create(
        idFriendHasTasks,
        sharedTasksInput
      );

      expect(result).toEqual(expectedReturn);

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO"),
        expect.arrayContaining([
          idFriendHasTasks,
          sharedTasksInput.idTask,
          sharedTasksInput.idAssignedUser,
          sharedTasksInput.friendHasTaskRequestState,
        ]),
        expect.any(Function)
      );
    });

    it("should throw an error if database query fails", async () => {
      const dbError = new Error("Insert failed");

      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[],
          callback: (err: Error | null, results?: any) => void
        ) => {
          callback(dbError);
        }
      );

      await expect(
        friendsHasTasksDAO.create(idFriendHasTasks, sharedTasksInput)
      ).rejects.toThrow("Insert failed");
    });
  });

  describe("FriendsMysqlDAO - update", () => {
    const idSharedTasks = "f1";
    const expectedReturn: FriendHasTasksReturn = {
      idFriendHasTasks: idSharedTasks,
      idTask: "",
      idAssignedUser: "",
      friendHasTaskRequestState: true,
    };

    it("should successfully update a friend's request state", async () => {
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[],
          callback: (err: Error | null, results?: any) => void
        ) => {
          callback(null, { affectedRows: 1 });
        }
      );

      const result = await friendsHasTasksDAO.update(idSharedTasks);

      expect(result).toEqual(expectedReturn);

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE"),
        expect.arrayContaining([idSharedTasks]),
        expect.any(Function)
      );
    });

    it("should return null if no rows were updated", async () => {
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[],
          callback: (err: Error | null, results?: any) => void
        ) => {
          callback(null, { affectedRows: 0 });
        }
      );

      const result = await friendsHasTasksDAO.update(idSharedTasks);

      expect(result).toBeNull();
    });

    it("should throw an error if database query fails", async () => {
      const dbError = new Error("Database crashed");

      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[],
          callback: (err: Error | null, results?: any) => void
        ) => {
          callback(dbError);
        }
      );

      await expect(friendsHasTasksDAO.update(idSharedTasks)).rejects.toThrow(
        /Database crashed/
      );
    });
  });

  describe("FriendsMysqlDAO - delete", () => {
    const mockConnection = mysql.createConnection();
    const idFriend = "f1";

    it("should return true when the friend is successfully deleted", async () => {
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[],
          callback: (err: any, results: any) => void
        ) => {
          callback(null, { affectedRows: 1 });
        }
      );

      const result = await friendsHasTasksDAO.delete(idFriend);

      expect(result).toBe(true);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining("DELETE FROM"),
        [idFriend],
        expect.any(Function)
      );
    });

    it("should throw an error if the friend is not found", async () => {
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[],
          callback: (err: any, results: any) => void
        ) => {
          callback(null, { affectedRows: 0 });
        }
      );

      await expect(friendsHasTasksDAO.delete(idFriend)).rejects.toThrow(
        "Amistad no encontrada"
      );
    });

    it("should throw an error if the database query fails", async () => {
      const dbError = new Error("Database failure");

      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[],
          callback: (err: any, results: any) => void
        ) => {
          callback(dbError, null);
        }
      );

      await expect(friendsHasTasksDAO.delete(idFriend)).rejects.toThrow(
        "Database failure"
      );
    });
  });
});
