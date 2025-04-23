import mysql from "@/tests/__mocks__/mysql";
import IFriendsDAO from "@/src/friends/model/dao/IFriendsDAO";
import {
  Friend,
  FriendBD,
  FriendCreate,
  FriendReturn,
} from "task-craft-models";

import FriendsMysqlDAO from "@/src/friends/model/dao/FriendsMysqlDAO";

jest.mock("mysql2", () => ({
  createConnection: mysql.createConnection,
}));

describe("TaskMysqlDAO", () => {
  let friendsDAO: IFriendsDAO;
  let mockConnection: any;

  beforeEach(() => {
    friendsDAO = new FriendsMysqlDAO();
    mockConnection = mysql.createConnection();
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe.only("getAll", () => {
    const mockResultsList: FriendBD[] = [
      {
        idFriend: "f1",
        idUser1: "u1",
        urlImg1: "https://img.com/u1.jpg",
        userName1: "Alice",
        email1: "alice@example.com",
        idUser2: "u2",
        urlImg2: "https://img.com/u2.jpg",
        userName2: "Bob",
        email2: "bob@example.com",
        friendRequestState: true,
      },
      {
        idFriend: "f2",
        idUser1: "u2",
        urlImg1: null,
        userName1: "Charlie",
        email1: "charlie@example.com",
        idUser2: "u3",
        urlImg2: "https://img.com/u4.jpg",
        userName2: "Diana",
        email2: "diana@example.com",
        friendRequestState: false,
      },
      {
        idFriend: "f3",
        idUser1: "u3",
        urlImg1: "https://img.com/u5.jpg",
        userName1: "Eve",
        email1: "eve@example.com",
        idUser2: "u1",
        urlImg2: null,
        userName2: "Frank",
        email2: "frank@example.com",
        friendRequestState: true,
      },
    ];

    it("should return an array of friends when query is successful", async () => {
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

      const expectedResults: Friend[] = mockResultsList.map((row) => ({
        idFriend: row.idFriend,
        firstUser: {
          idUser: row.idUser1,
          urlImg: row.urlImg1,
          userName: row.userName1,
          email: row.email1,
        },
        secondUser: {
          idUser: row.idUser2,
          urlImg: row.urlImg2,
          userName: row.userName2,
          email: row.email2,
        },
        friendRequestState: row.friendRequestState,
      }));

      const friends = await friendsDAO.getAll({});

      expect(friends).toEqual(expectedResults);
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

      await expect(friendsDAO.getAll({})).rejects.toThrow("Database error");
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

      await expect(friendsDAO.getAll({})).rejects.toThrow(
        "Expected array of results but got something else."
      );
    });

    it("should return an empty array if no friends are found", async () => {
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

      const friends = await friendsDAO.getAll({});
      expect(friends).toEqual([]);
    });

    it("should handle filtering friends by the first idUser", async () => {
      const idUser = "u1";

      const filteredResults = mockResultsList.filter(
        (row) => row.idUser2 === idUser
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

      const friends = await friendsDAO.getAll({ idSecondUser: idUser });

      const expectedResults = filteredResults.map((row) => ({
        idFriend: row.idFriend,
        firstUser: {
          idUser: row.idUser1,
          urlImg: row.urlImg1,
          userName: row.userName1,
          email: row.email1,
        },
        secondUser: {
          idUser: row.idUser2,
          urlImg: row.urlImg2,
          userName: row.userName2,
          email: row.email2,
        },
        friendRequestState: row.friendRequestState,
      }));

      expect(friends).toEqual(expectedResults);
    });

    it("should handle filtering friends by the second idUser", async () => {
      const idUser = "u2";

      const filteredResults = mockResultsList.filter(
        (row) => row.idUser1 === idUser
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

      const friends = await friendsDAO.getAll({ idFirstUser: idUser });

      const expectedResults = filteredResults.map((row) => ({
        idFriend: row.idFriend,
        firstUser: {
          idUser: row.idUser1,
          urlImg: row.urlImg1,
          userName: row.userName1,
          email: row.email1,
        },
        secondUser: {
          idUser: row.idUser2,
          urlImg: row.urlImg2,
          userName: row.userName2,
          email: row.email2,
        },
        friendRequestState: row.friendRequestState,
      }));

      expect(friends).toEqual(expectedResults);
    });
    it("should handle filtering friends by the both idUser", async () => {
      const idUser1 = "u2";
      const idUser2 = "u2";

      const filteredResults = mockResultsList.filter(
        (row) => row.idUser1 === idUser1 && row.idUser2 === idUser2
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

      const friends = await friendsDAO.getAll({
        idFirstUser: idUser1,
        idSecondUser: idUser2,
      });

      const expectedResults = filteredResults.map((row) => ({
        idFriend: row.idFriend,
        firstUser: {
          idUser: row.idUser1,
          urlImg: row.urlImg1,
          userName: row.userName1,
          email: row.email1,
        },
        secondUser: {
          idUser: row.idUser2,
          urlImg: row.urlImg2,
          userName: row.userName2,
          email: row.email2,
        },
        friendRequestState: row.friendRequestState,
      }));

      expect(friends).toEqual(expectedResults);
    });
    it("should handle filtering by friendRequestState = true", async () => {
      const filteredResults = mockResultsList.filter(
        (row) => row.friendRequestState === true
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

      const friends = await friendsDAO.getAll({ friendRequestState: true });

      const expectedResults = filteredResults.map((row) => ({
        idFriend: row.idFriend,
        firstUser: {
          idUser: row.idUser1,
          urlImg: row.urlImg1,
          userName: row.userName1,
          email: row.email1,
        },
        secondUser: {
          idUser: row.idUser2,
          urlImg: row.urlImg2,
          userName: row.userName2,
          email: row.email2,
        },
        friendRequestState: row.friendRequestState,
      }));

      expect(friends).toEqual(expectedResults);
    });

    it("should handle filtering by friendRequestState = false", async () => {
      const filteredResults = mockResultsList.filter(
        (row) => row.friendRequestState === false
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

      const friends = await friendsDAO.getAll({ friendRequestState: false });

      const expectedResults = filteredResults.map((row) => ({
        idFriend: row.idFriend,
        firstUser: {
          idUser: row.idUser1,
          urlImg: row.urlImg1,
          userName: row.userName1,
          email: row.email1,
        },
        secondUser: {
          idUser: row.idUser2,
          urlImg: row.urlImg2,
          userName: row.userName2,
          email: row.email2,
        },
        friendRequestState: row.friendRequestState,
      }));

      expect(friends).toEqual(expectedResults);
    });

    it.only("should handle filtering friends when idFirstUser and idSecondUser are the same (OR logic)", async () => {
      const idUser = "u1";
    
      // Simula que el usuario aparece como firstUser o secondUser
      const filteredResults = mockResultsList.filter(
        (row) => row.idUser1 === idUser || row.idUser2 === idUser
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
            expect(params).toEqual([idUser, idUser]); // Verifica que se pasa el mismo ID dos veces
            callback(null, filteredResults);
          }
        }
      );
    
      const friends = await friendsDAO.getAll({
        idFirstUser: idUser,
        idSecondUser: idUser, // Al ser iguales, se aplica lógica de OR
      });
    
      const expectedResults = filteredResults.map((row) => ({
        idFriend: row.idFriend,
        firstUser: {
          idUser: row.idUser1,
          urlImg: row.urlImg1,
          userName: row.userName1,
          email: row.email1,
        },
        secondUser: {
          idUser: row.idUser2,
          urlImg: row.urlImg2,
          userName: row.userName2,
          email: row.email2,
        },
        friendRequestState: row.friendRequestState,
      }));
    
      expect(friends).toEqual(expectedResults);
    });
    
  });

  describe("getById", () => {
    const mockFriendRow: FriendBD = {
      idFriend: "f1",
      idUser1: "u1",
      idUser2: "u2",
      urlImg1: "urlImg1",
      userName1: "User1",
      email1: "user1@example.com",
      urlImg2: "urlImg2",
      userName2: "User2",
      email2: "user2@example.com",
      friendRequestState: true,
    };

    it("should return a friend when a valid ID is provided", async () => {
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[] | ((err: Error | null, results?: any[]) => void),
          callback?: (err: Error | null, results?: any[]) => void
        ) => {
          if (typeof params === "function") {
            params(null, [mockFriendRow]);
          } else if (callback) {
            callback(null, [mockFriendRow]);
          }
        }
      );

      const friend = await friendsDAO.getById("f1");

      expect(friend).toEqual({
        idFriend: mockFriendRow.idFriend,
        firstUser: {
          idUser: mockFriendRow.idUser1,
          urlImg: mockFriendRow.urlImg1,
          userName: mockFriendRow.userName1,
          email: mockFriendRow.email1,
        },
        secondUser: {
          idUser: mockFriendRow.idUser2,
          urlImg: mockFriendRow.urlImg2,
          userName: mockFriendRow.userName2,
          email: mockFriendRow.email2,
        },
        friendRequestState: mockFriendRow.friendRequestState,
      });

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining("WHERE"),
        ["f1"],
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

      const result = await friendsDAO.getById("not-found-id");
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

      await expect(friendsDAO.getById("f1")).rejects.toThrow("Query failed");
    });
  });

  describe("FriendsMysqlDAO - create", () => {
    const idFriend = "f1";
    const friendInput: FriendCreate = {
      firstUser: "user-123",
      secondUser: "user-456",
      friendRequestState: false,
    };

    const expectedReturn: FriendReturn = {
      idFriend: idFriend,
      firstUser: friendInput.firstUser,
      secondUser: friendInput.secondUser,
      friendRequestState: friendInput.friendRequestState,
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

      const result = await friendsDAO.create(idFriend, friendInput);

      expect(result).toEqual(expectedReturn);

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO"),
        expect.arrayContaining([
          idFriend,
          friendInput.firstUser,
          friendInput.secondUser,
          friendInput.friendRequestState,
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

      await expect(friendsDAO.create(idFriend, friendInput)).rejects.toThrow(
        "Insert failed"
      );
    });
  });

  describe("FriendsMysqlDAO - update", () => {
    const mockConnection = mysql.createConnection();

    const idFriend = "f1";
    const expectedReturn: FriendReturn = {
      idFriend: idFriend,
      firstUser: "",
      secondUser: "",
      friendRequestState: true,
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

      const result = await friendsDAO.update(idFriend);

      expect(result).toEqual(expectedReturn);

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE"),
        expect.arrayContaining([idFriend]),
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

      const result = await friendsDAO.update(idFriend);

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

      await expect(friendsDAO.update(idFriend)).rejects.toThrow(
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

      const result = await friendsDAO.delete(idFriend);

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

      await expect(friendsDAO.delete(idFriend)).rejects.toThrow(
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

      await expect(friendsDAO.delete(idFriend)).rejects.toThrow(
        "Database failure"
      );
    });
  });
});
