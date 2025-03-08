import UsuariosModel from "@/src/usuarios/UsuariosModel";
import {
  Usuario,
  UsuarioCreate,
  UsuarioUpdate,
  AuthResponse,
  LoginCredentials,
  PaginatedUsers,
  UserFilters,
} from "@/src/usuarios/interfacesUsuarios";
import IUsuariosDAO from "@/src/usuarios/dao/IUsuariosDAO";
import supabase from "../__mocks__/supabase";

jest.mock("@/config/supabase", () => ({
  __esModule: true,
  default: supabase,
}));

// Mock the DAO
const usuariosDAOMock: IUsuariosDAO = {
  signUp: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  resetPassword: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  changePassword: jest.fn(),
  resetEmail: jest.fn(),
};

// Create an instance of UsuariosModel with the mocked DAO
const usuariosModel = new UsuariosModel(usuariosDAOMock);

describe("UsuariosModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("signUp", () => {
    const usuarioCreate: UsuarioCreate = {
      email: "test@example.com",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
    };

    it("should call signUp on the DAO with the correct arguments", async () => {
      const user: Usuario = {
        id: "123",
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        role: "user",
        createdAt: "2025-03-08T00:00:00Z",
        updatedAt: "2025-03-08T00:00:00Z",
      };
      // Arrange: Mock the DAO's signUp method to return a mock response
      const mockAuthResponse: AuthResponse = {
        user: user,
        session: null,
      };
      (usuariosDAOMock.signUp as jest.Mock).mockResolvedValue(mockAuthResponse);

      // Act: Call the signUp method
      const result = await usuariosModel.signUp(usuarioCreate);

      // Assert: Verify that the DAO method was called with the correct arguments
      expect(usuariosDAOMock.signUp).toHaveBeenCalledWith(usuarioCreate);

      // Assert: Verify that the result matches the mockAuthResponse
      expect(result).toEqual(mockAuthResponse);
    });

    it("should return an error response if signUp fails", async () => {
      // Arrange: Mock the DAO's signUp method to simulate an error
      const mockErrorResponse: AuthResponse = {
        user: null,
        session: null,
        error: "Error creating user",
      };
      (usuariosDAOMock.signUp as jest.Mock).mockResolvedValue(
        mockErrorResponse
      );

      // Act: Call the signUp method
      const result = await usuariosModel.signUp(usuarioCreate);

      // Assert: Verify that the DAO method was called with the correct arguments
      expect(usuariosDAOMock.signUp).toHaveBeenCalledWith(usuarioCreate);

      // Assert: Verify that the result matches the error response
      expect(result).toEqual(mockErrorResponse);
    });
  });

  describe("signIn", () => {
    const loginCredentials: LoginCredentials = {
      email: "test@example.com",
      password: "password123",
    };

    it("should call signIn on the DAO with the correct arguments", async () => {
      // Arrange: Mock the DAO's signIn method to return a mock response
      const mockAuthResponse: AuthResponse = {
        user: {
          id: "123",
          email: "test@example.com",
          firstName: "John",
          lastName: "Doe",
          role: "user",
          createdAt: "2025-03-08T00:00:00Z",
          updatedAt: "2025-03-08T00:00:00Z",
        },
        session: null,
      };
      (usuariosDAOMock.signIn as jest.Mock).mockResolvedValue(mockAuthResponse);

      // Act: Call the signIn method
      const result = await usuariosModel.signIn(loginCredentials);

      // Assert: Verify that the DAO method was called with the correct arguments
      expect(usuariosDAOMock.signIn).toHaveBeenCalledWith(loginCredentials);

      // Assert: Verify that the result matches the mockAuthResponse
      expect(result).toEqual(mockAuthResponse);
    });

    it("should return an error response if signIn fails", async () => {
      // Arrange: Mock the DAO's signIn method to simulate an error
      const mockErrorResponse: AuthResponse = {
        user: null,
        session: null,
        error: "Invalid credentials",
      };
      (usuariosDAOMock.signIn as jest.Mock).mockResolvedValue(
        mockErrorResponse
      );

      // Act: Call the signIn method
      const result = await usuariosModel.signIn(loginCredentials);

      // Assert: Verify that the DAO method was called with the correct arguments
      expect(usuariosDAOMock.signIn).toHaveBeenCalledWith(loginCredentials);

      // Assert: Verify that the result matches the error response
      expect(result).toEqual(mockErrorResponse);
    });
  });

  describe("signOut", () => {
    it("should call signOut on the DAO", async () => {
      // Arrange: Mock the DAO's signOut method to simulate a successful sign-out
      (usuariosDAOMock.signOut as jest.Mock).mockResolvedValue(undefined); // since it doesn't return anything

      // Act: Call the signOut method
      await usuariosModel.signOut();

      // Assert: Verify that the DAO method was called
      expect(usuariosDAOMock.signOut).toHaveBeenCalled();
    });

    it("should throw an error if signOut fails", async () => {
      // Arrange: Mock the DAO's signOut method to simulate an error
      const mockError = new Error("Error signing out");
      (usuariosDAOMock.signOut as jest.Mock).mockRejectedValue(mockError);

      // Act & Assert: Ensure the signOut method throws the error
      await expect(usuariosModel.signOut()).rejects.toThrow(
        "Error signing out"
      );

      // Assert: Verify that the DAO method was called
      expect(usuariosDAOMock.signOut).toHaveBeenCalled();
    });
  });

  describe("resetPassword", () => {
    const email = "test@example.com";

    it("should call resetPassword on the DAO with the correct email", async () => {
      // Arrange: Mock the DAO's resetPassword method to return a successful response
      (usuariosDAOMock.resetPassword as jest.Mock).mockResolvedValue(true);

      // Act: Call the resetPassword method
      const result = await usuariosModel.resetPassword(email);

      // Assert: Verify that the DAO method was called with the correct arguments
      expect(usuariosDAOMock.resetPassword).toHaveBeenCalledWith(email);

      // Assert: Verify that the result is true (successful reset)
      expect(result).toBe(true);
    });

    it("should return false if resetPassword fails", async () => {
      // Arrange: Mock the DAO's resetPassword method to simulate a failure
      (usuariosDAOMock.resetPassword as jest.Mock).mockResolvedValue(false);

      // Act: Call the resetPassword method
      const result = await usuariosModel.resetPassword(email);

      // Assert: Verify that the DAO method was called with the correct arguments
      expect(usuariosDAOMock.resetPassword).toHaveBeenCalledWith(email);

      // Assert: Verify that the result is false (failure to reset)
      expect(result).toBe(false);
    });

    it("should throw an error if resetPassword throws an exception", async () => {
      // Arrange: Mock the DAO's resetPassword method to simulate an exception
      const mockError = new Error("Error resetting password");
      (usuariosDAOMock.resetPassword as jest.Mock).mockRejectedValue(mockError);

      // Act & Assert: Ensure the resetPassword method throws the error
      await expect(usuariosModel.resetPassword(email)).rejects.toThrow(
        "Error resetting password"
      );

      // Assert: Verify that the DAO method was called with the correct arguments
      expect(usuariosDAOMock.resetPassword).toHaveBeenCalledWith(email);
    });
  });

  describe("getAll", () => {
    const filters: UserFilters = {
      role: "user",
      searchTerm: "John",
      sortBy: "createdAt",
      sortOrder: "asc",
      page: 1,
      limit: 10,
    };

    it("should call getAll on the DAO with the correct filters and return paginated users", async () => {
      // Arrange: Mock the DAO's getAll method to return a paginated users response
      const mockPaginatedUsers: PaginatedUsers = {
        users: [
          {
            id: "123",
            email: "john.doe@example.com",
            firstName: "John",
            lastName: "Doe",
            role: "user",
            createdAt: "2025-03-08T00:00:00Z",
            updatedAt: "2025-03-08T00:00:00Z",
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      (usuariosDAOMock.getAll as jest.Mock).mockResolvedValue(
        mockPaginatedUsers
      );

      // Act: Call the getAll method with filters
      const result = await usuariosModel.getAll(filters);

      // Assert: Verify that the DAO method was called with the correct filters
      expect(usuariosDAOMock.getAll).toHaveBeenCalledWith(filters);

      // Assert: Verify that the result matches the mock paginated users
      expect(result).toEqual(mockPaginatedUsers);
    });

    it("should call getAll on the DAO with no filters and return all users", async () => {
      // Arrange: Mock the DAO's getAll method to return a paginated users response
      const mockPaginatedUsers: PaginatedUsers = {
        users: [
          {
            id: "123",
            email: "john.doe@example.com",
            firstName: "John",
            lastName: "Doe",
            role: "user",
            createdAt: "2025-03-08T00:00:00Z",
            updatedAt: "2025-03-08T00:00:00Z",
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      (usuariosDAOMock.getAll as jest.Mock).mockResolvedValue(
        mockPaginatedUsers
      );

      // Act: Call the getAll method with no filters
      const result = await usuariosModel.getAll();

      // Assert: Verify that the DAO method was called with no filters
      expect(usuariosDAOMock.getAll).toHaveBeenCalledWith(undefined);

      // Assert: Verify that the result matches the mock paginated users
      expect(result).toEqual(mockPaginatedUsers);
    });

    it("should handle errors when getAll fails", async () => {
      // Arrange: Mock the DAO's getAll method to throw an error
      const mockError = new Error("Error fetching users");
      (usuariosDAOMock.getAll as jest.Mock).mockRejectedValue(mockError);

      // Act & Assert: Ensure the getAll method throws the error
      await expect(usuariosModel.getAll(filters)).rejects.toThrow(
        "Error fetching users"
      );

      // Assert: Verify that the DAO method was called with the correct filters
      expect(usuariosDAOMock.getAll).toHaveBeenCalledWith(filters);
    });
  });

  describe("getById", () => {
    const userId = "123";

    it("should call getById on the DAO with the correct id and return the user", async () => {
      // Arrange: Mock the DAO's getById method to return a user
      const mockUser: Usuario = {
        id: "123",
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
        role: "user",
        createdAt: "2025-03-08T00:00:00Z",
        updatedAt: "2025-03-08T00:00:00Z",
      };
      (usuariosDAOMock.getById as jest.Mock).mockResolvedValue(mockUser);

      // Act: Call the getById method
      const result = await usuariosModel.getById(userId);

      // Assert: Verify that the DAO method was called with the correct id
      expect(usuariosDAOMock.getById).toHaveBeenCalledWith(userId);

      // Assert: Verify that the result matches the mock user
      expect(result).toEqual(mockUser);
    });

    it("should return null if the user is not found", async () => {
      // Arrange: Mock the DAO's getById method to return null (user not found)
      (usuariosDAOMock.getById as jest.Mock).mockResolvedValue(null);

      // Act: Call the getById method
      const result = await usuariosModel.getById(userId);

      // Assert: Verify that the DAO method was called with the correct id
      expect(usuariosDAOMock.getById).toHaveBeenCalledWith(userId);

      // Assert: Verify that the result is null
      expect(result).toBeNull();
    });

    it("should handle errors when getById fails", async () => {
      // Arrange: Mock the DAO's getById method to throw an error
      const mockError = new Error("Error fetching user by ID");
      (usuariosDAOMock.getById as jest.Mock).mockRejectedValue(mockError);

      // Act & Assert: Ensure the getById method throws the error
      await expect(usuariosModel.getById(userId)).rejects.toThrow(
        "Error fetching user by ID"
      );

      // Assert: Verify that the DAO method was called with the correct id
      expect(usuariosDAOMock.getById).toHaveBeenCalledWith(userId);
    });
  });

  describe("delete", () => {
    const userId = "123";

    it("should call delete on the DAO with the correct id and return true on success", async () => {
      // Arrange: Mock the DAO's delete method to return true
      (usuariosDAOMock.delete as jest.Mock).mockResolvedValue(true);

      // Act: Call the delete method
      const result = await usuariosModel.delete(userId);

      // Assert: Verify that the DAO method was called with the correct id
      expect(usuariosDAOMock.delete).toHaveBeenCalledWith(userId);

      // Assert: Verify that the result is true (user deleted successfully)
      expect(result).toBe(true);
    });

    it("should return false if delete fails", async () => {
      // Arrange: Mock the DAO's delete method to return false (deletion failed)
      (usuariosDAOMock.delete as jest.Mock).mockResolvedValue(false);

      // Act: Call the delete method
      const result = await usuariosModel.delete(userId);

      // Assert: Verify that the DAO method was called with the correct id
      expect(usuariosDAOMock.delete).toHaveBeenCalledWith(userId);

      // Assert: Verify that the result is false (deletion failed)
      expect(result).toBe(false);
    });

    it("should handle errors when delete fails", async () => {
      // Arrange: Mock the DAO's delete method to throw an error
      const mockError = new Error("Error deleting user");
      (usuariosDAOMock.delete as jest.Mock).mockRejectedValue(mockError);

      // Act & Assert: Ensure the delete method throws the error
      await expect(usuariosModel.delete(userId)).rejects.toThrow(
        "Error deleting user"
      );

      // Assert: Verify that the DAO method was called with the correct id
      expect(usuariosDAOMock.delete).toHaveBeenCalledWith(userId);
    });
  });

  describe("create", () => {
    const newUser: UsuarioCreate = {
      email: "jane.doe@example.com",
      password: "password123",
      firstName: "Jane",
      lastName: "Doe",
      role: "user",
    };

    it("should call create on the DAO with the correct user and return the created user", async () => {
      // Arrange: Mock the DAO's create method to return the created user
      const mockUser: Usuario = {
        id: "124",
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: "user",
        createdAt: "2025-03-08T00:00:00Z",
        updatedAt: "2025-03-08T00:00:00Z",
      };
      (usuariosDAOMock.create as jest.Mock).mockResolvedValue(mockUser);

      // Act: Call the create method
      const result = await usuariosModel.create(newUser);

      // Assert: Verify that the DAO method was called with the correct user
      expect(usuariosDAOMock.create).toHaveBeenCalledWith(newUser);

      // Assert: Verify that the result matches the mock created user
      expect(result).toEqual(mockUser);
    });

    it("should return null if create fails", async () => {
      // Arrange: Mock the DAO's create method to return null (failed creation)
      (usuariosDAOMock.create as jest.Mock).mockResolvedValue(null);

      // Act: Call the create method
      const result = await usuariosModel.create(newUser);

      // Assert: Verify that the DAO method was called with the correct user
      expect(usuariosDAOMock.create).toHaveBeenCalledWith(newUser);

      // Assert: Verify that the result is null (failed creation)
      expect(result).toBeNull();
    });

    it("should handle errors when create fails", async () => {
      // Arrange: Mock the DAO's create method to throw an error
      const mockError = new Error("Error creating user");
      (usuariosDAOMock.create as jest.Mock).mockRejectedValue(mockError);

      // Act & Assert: Ensure the create method throws the error
      await expect(usuariosModel.create(newUser)).rejects.toThrow(
        "Error creating user"
      );

      // Assert: Verify that the DAO method was called with the correct user
      expect(usuariosDAOMock.create).toHaveBeenCalledWith(newUser);
    });
  });

  describe("update", () => {
    const userId = "123";
    const updatedUser: UsuarioUpdate = {
      firstName: "Updated Name",
      lastName: "Updated LastName",
      role: "admin",
    };

    it("should call update on the DAO with the correct id and updated user data", async () => {
      // Arrange: Mock the DAO's update method to return the updated user
      const mockUpdatedUser: Usuario = {
        id: userId,
        email: "john.doe@example.com",
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: "admin",
        createdAt: "2025-03-08T00:00:00Z",
        updatedAt: "2025-03-08T00:00:00Z",
      };
      (usuariosDAOMock.update as jest.Mock).mockResolvedValue(mockUpdatedUser);

      // Act: Call the update method
      const result = await usuariosModel.update(userId, updatedUser);

      // Assert: Verify that the DAO method was called with the correct id and updated user data
      expect(usuariosDAOMock.update).toHaveBeenCalledWith(userId, updatedUser);

      // Assert: Verify that the result matches the mock updated user
      expect(result).toEqual(mockUpdatedUser);
    });

    it("should return null if update fails", async () => {
      // Arrange: Mock the DAO's update method to return null (failed update)
      (usuariosDAOMock.update as jest.Mock).mockResolvedValue(null);

      // Act: Call the update method
      const result = await usuariosModel.update(userId, updatedUser);

      // Assert: Verify that the DAO method was called with the correct id and updated user data
      expect(usuariosDAOMock.update).toHaveBeenCalledWith(userId, updatedUser);

      // Assert: Verify that the result is null (failed update)
      expect(result).toBeNull();
    });

    it("should handle errors when update fails", async () => {
      // Arrange: Mock the DAO's update method to throw an error
      const mockError = new Error("Error updating user");
      (usuariosDAOMock.update as jest.Mock).mockRejectedValue(mockError);

      // Act & Assert: Ensure the update method throws the error
      await expect(usuariosModel.update(userId, updatedUser)).rejects.toThrow(
        "Error updating user"
      );

      // Assert: Verify that the DAO method was called with the correct id and updated user data
      expect(usuariosDAOMock.update).toHaveBeenCalledWith(userId, updatedUser);
    });
  });

  describe("changePassword", () => {
    const newPassword = "newPassword123";

    it("should call changePassword on the DAO with the correct new password and return true on success", async () => {
      // Arrange: Mock the DAO's changePassword method to return true
      (usuariosDAOMock.changePassword as jest.Mock).mockResolvedValue(true);

      // Act: Call the changePassword method
      const result = await usuariosModel.changePassword(newPassword);

      // Assert: Verify that the DAO method was called with the correct new password
      expect(usuariosDAOMock.changePassword).toHaveBeenCalledWith(newPassword);

      // Assert: Verify that the result is true (password changed successfully)
      expect(result).toBe(true);
    });

    it("should return false if changePassword fails", async () => {
      // Arrange: Mock the DAO's changePassword method to return false (failed password change)
      (usuariosDAOMock.changePassword as jest.Mock).mockResolvedValue(false);

      // Act: Call the changePassword method
      const result = await usuariosModel.changePassword(newPassword);

      // Assert: Verify that the DAO method was called with the correct new password
      expect(usuariosDAOMock.changePassword).toHaveBeenCalledWith(newPassword);

      // Assert: Verify that the result is false (failed password change)
      expect(result).toBe(false);
    });

    it("should handle errors when changePassword fails", async () => {
      // Arrange: Mock the DAO's changePassword method to throw an error
      const mockError = new Error("Error changing password");
      (usuariosDAOMock.changePassword as jest.Mock).mockRejectedValue(
        mockError
      );

      // Act & Assert: Ensure the changePassword method throws the error
      await expect(usuariosModel.changePassword(newPassword)).rejects.toThrow(
        "Error changing password"
      );

      // Assert: Verify that the DAO method was called with the correct new password
      expect(usuariosDAOMock.changePassword).toHaveBeenCalledWith(newPassword);
    });
  });

  describe("resetEmail", () => {
    const email = "new.email@example.com";

    it("should call resetEmail on the DAO with the correct email and return true on success", async () => {
      // Arrange: Mock the DAO's resetEmail method to return true
      (usuariosDAOMock.resetEmail as jest.Mock).mockResolvedValue(true);

      // Act: Call the resetEmail method
      const result = await usuariosModel.resetEmail(email);

      // Assert: Verify that the DAO method was called with the correct email
      expect(usuariosDAOMock.resetEmail).toHaveBeenCalledWith(email);

      // Assert: Verify that the result is true (email reset successfully)
      expect(result).toBe(true);
    });

    it("should return false if resetEmail fails", async () => {
      // Arrange: Mock the DAO's resetEmail method to return false (failed reset)
      (usuariosDAOMock.resetEmail as jest.Mock).mockResolvedValue(false);

      // Act: Call the resetEmail method
      const result = await usuariosModel.resetEmail(email);

      // Assert: Verify that the DAO method was called with the correct email
      expect(usuariosDAOMock.resetEmail).toHaveBeenCalledWith(email);

      // Assert: Verify that the result is false (failed reset)
      expect(result).toBe(false);
    });

    it("should handle errors when resetEmail fails", async () => {
      // Arrange: Mock the DAO's resetEmail method to throw an error
      const mockError = new Error("Error resetting email");
      (usuariosDAOMock.resetEmail as jest.Mock).mockRejectedValue(mockError);

      // Act & Assert: Ensure the resetEmail method throws the error
      await expect(usuariosModel.resetEmail(email)).rejects.toThrow(
        "Error resetting email"
      );

      // Assert: Verify that the DAO method was called with the correct email
      expect(usuariosDAOMock.resetEmail).toHaveBeenCalledWith(email);
    });
  });
});
