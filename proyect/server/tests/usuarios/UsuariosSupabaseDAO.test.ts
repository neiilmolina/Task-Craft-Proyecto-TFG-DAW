jest.mock("@/config/supabase", () => require("@/tests/__mocks__/supabase")); // Mockea el cliente de Supabase

import UsuariosSupabaseDAO from "@/src/usuarios/dao/UsuariosSupabaseDAO";
import {
  UsuarioCreate,
  LoginCredentials,
  UsuarioUpdate,
} from "@/src/usuarios/interfacesUsuarios";
import supabase from "@/tests/__mocks__/supabase";

describe("UsuariosSupabaseDAO", () => {
  let usuariosDAO: UsuariosSupabaseDAO;

  beforeEach(() => {
    usuariosDAO = new UsuariosSupabaseDAO();
    jest.clearAllMocks();
  });

  describe("signUp", () => {
    it("should successfully sign up a user", async () => {
      const mockUser = { id: "123", email: "test@example.com" };
      supabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const userData: UsuarioCreate = {
        email: "test@example.com",
        password: "password123",
        role: "user",
        user_metadata: { first_name: "Test", last_name: "User" },
      };

      const result = await usuariosDAO.signUp(userData);

      expect(result.user).toEqual(mockUser);
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            role: userData.role,
            ...userData.user_metadata,
          },
        },
      });
    });
  });

  describe("signIn", () => {
    it("should successfully sign in a user", async () => {
      const mockUser = { id: "123", email: "test@example.com" };
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const credentials: LoginCredentials = {
        email: "test@example.com",
        password: "password123",
      };

      const result = await usuariosDAO.signIn(credentials);

      expect(result.user).toEqual(mockUser);
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith(
        credentials
      );
    });
  });

  describe("signOut", () => {
    it("should successfully sign out a user", async () => {
      supabase.auth.signOut.mockResolvedValue({ error: null });

      await expect(usuariosDAO.signOut()).resolves.toBeUndefined();
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it("should throw an error if signOut fails", async () => {
      const mockError = new Error("Sign out failed");
      supabase.auth.signOut.mockResolvedValue({ error: mockError });

      await expect(usuariosDAO.signOut()).rejects.toThrow("Sign out failed");
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });

  describe("resetPassword", () => {
    it("should successfully reset the password", async () => {
      supabase.auth.resetPasswordForEmail.mockResolvedValue({ error: null });

      const result = await usuariosDAO.resetPassword("test@example.com");
      expect(result).toBe(true);
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
    });

    it("should return false if resetting password fails", async () => {
      const mockError = new Error("Reset password failed");
      supabase.auth.resetPasswordForEmail.mockResolvedValue({
        error: mockError,
      });

      const result = await usuariosDAO.resetPassword("test@example.com");
      expect(result).toBe(false);
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
    });
  });

  describe("getAll", () => {
    it("should return a paginated list of users", async () => {
      const mockUsers = [{ id: "1" }, { id: "2" }];
      supabase.auth.admin.listUsers.mockResolvedValue({
        data: { users: mockUsers },
        error: null,
      });

      const result = await usuariosDAO.getAll({ page: 1, limit: 2 });

      expect(result.users).toEqual(mockUsers);
      expect(result.total).toBe(2);
      expect(supabase.auth.admin.listUsers).toHaveBeenCalled();
    });
  });

  describe("getById", () => {
    it("should successfully get a user by ID", async () => {
      const mockUser = { id: "123", email: "test@example.com" };
      supabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await usuariosDAO.getById("123");

      expect(result).toEqual(mockUser);
      expect(supabase.auth.getUser).toHaveBeenCalledWith("123");
    });

    it("should return null if an error occurs while getting the user", async () => {
      const mockError = new Error("User not found");
      supabase.auth.getUser.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const result = await usuariosDAO.getById("123");

      expect(result).toBeNull();
      expect(supabase.auth.getUser).toHaveBeenCalledWith("123");
    });
  });

  describe("delete", () => {
    it("should delete a user by ID", async () => {
      supabase.auth.admin.deleteUser.mockResolvedValue({ error: null });

      const result = await usuariosDAO.delete("123");

      expect(result).toBe(true);
      expect(supabase.auth.admin.deleteUser).toHaveBeenCalledWith("123");
    });
  });

  describe("create", () => {
    it("should successfully create a user", async () => {
      const mockUser = { id: "123", email: "test@example.com" };
      supabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const userData: UsuarioCreate = {
        email: "test@example.com",
        password: "password123",
        role: "user",
        user_metadata: { first_name: "Test", last_name: "User" },
      };

      const result = await usuariosDAO.create(userData);

      expect(result).toEqual(mockUser);
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            role: userData.role,
            ...userData.user_metadata,
          },
        },
      });
    });

    it("should return null if an error occurs during user creation", async () => {
      const mockError = new Error("User already exists");
      supabase.auth.signUp.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const userData: UsuarioCreate = {
        email: "test@example.com",
        password: "password123",
        role: "user",
        user_metadata: { first_name: "Test", last_name: "User" },
      };

      const result = await usuariosDAO.create(userData);

      expect(result).toBeNull();
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            role: userData.role,
            ...userData.user_metadata,
          },
        },
      });
    });
  });

  describe("update", () => {
    it("should update a user's data", async () => {
      const mockUser = { id: "123", email: "updated@example.com" };
      supabase.auth.admin.updateUserById.mockResolvedValue({
        uid: "123",
        email: "updated@example.com",
        user_metadata: { first_name: "Updated", last_name: "User" },
        data: { user: mockUser },
        error: null,
      });

      const userData: UsuarioUpdate = {
        email: "updated@example.com",
        role: "admin",
        user_metadata: { first_name: "Updated", last_name: "User" },
        app_metadata: {},
      };

      const result = await usuariosDAO.update("123", userData);

      expect(result).toEqual(mockUser);
      expect(supabase.auth.admin.updateUserById).toHaveBeenCalledWith(
        "123",
        expect.any(Object)
      );
    });
  });

  describe("changePassword", () => {
    it("should successfully change the user's password", async () => {
      supabase.auth.updateUser.mockResolvedValue({ error: null });

      const result = await usuariosDAO.changePassword("newPassword123");

      expect(result).toBe(true);
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        password: "newPassword123",
      });
    });

    it("should return false if an error occurs while changing the password", async () => {
      const mockError = new Error("Failed to change password");
      supabase.auth.updateUser.mockResolvedValue({ error: mockError });

      const result = await usuariosDAO.changePassword("newPassword123");

      expect(result).toBe(false);
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        password: "newPassword123",
      });
    });
  });

  describe("resetEmail", () => {
    it("should successfully initiate the email reset process", async () => {
      supabase.auth.resetPasswordForEmail.mockResolvedValue({ error: null });

      const result = await usuariosDAO.resetEmail("test@example.com");

      expect(result).toBe(true);
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        "test@example.com",
        { redirectTo: "https://your-app-url.com/reset-email" }
      );
    });

    it("should return false if an error occurs while resetting the email", async () => {
      const mockError = new Error("Failed to reset email");
      supabase.auth.resetPasswordForEmail.mockResolvedValue({
        error: mockError,
      });

      const result = await usuariosDAO.resetEmail("test@example.com");

      expect(result).toBe(false);
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        "test@example.com",
        { redirectTo: "https://your-app-url.com/reset-email" }
      );
    });
  });
});
