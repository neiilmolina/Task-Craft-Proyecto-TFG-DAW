import UsuariosModel from "@/src/usuarios/UsuariosModel";
import {
  UsuarioCreate,
  UsuarioUpdate,
  AuthResponse,
  LoginCredentials,
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

  it("should sign up a new user", async () => {
    const newUser: UsuarioCreate = {
      email: "test@example.com",
      password: "password123",
      firstName: "Test",
      lastName: "User",
      role: "user",
    };

    const authResponse: AuthResponse = {
      user: {
        id: "1",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        role: "user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
      },
      session: null,
      error: undefined,
    };

    (usuariosDAOMock.signUp as jest.Mock).mockResolvedValue(authResponse);

    const result = await usuariosModel.signUp(newUser);

    expect(usuariosDAOMock.signUp).toHaveBeenCalledWith(newUser);
    expect(result).toEqual(authResponse);
  });

  it("should sign in a user", async () => {
    const credentials: LoginCredentials = {
      email: "test@example.com",
      password: "password123",
    };

    const authResponse: AuthResponse = {
      user: {
        id: "1",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        role: "user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
      },
      session: null,
      error: undefined,
    };

    (usuariosDAOMock.signIn as jest.Mock).mockResolvedValue(authResponse);

    const result = await usuariosModel.signIn(credentials);

    expect(usuariosDAOMock.signIn).toHaveBeenCalledWith(credentials);
    expect(result).toEqual(authResponse);
  });

  it("should sign out a user", async () => {
    (usuariosDAOMock.signOut as jest.Mock).mockResolvedValue(undefined);

    await usuariosModel.signOut();

    expect(usuariosDAOMock.signOut).toHaveBeenCalled();
  });

  it("should get all users", async () => {
    const users = [
      {
        id: "1",
        email: "test1@example.com",
        firstName: "Test1",
        lastName: "User1",
        role: "user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        email: "test2@example.com",
        firstName: "Test2",
        lastName: "User2",
        role: "admin",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
      },
    ];

    (usuariosDAOMock.getAll as jest.Mock).mockResolvedValue(users);

    const result = await usuariosModel.getAll();

    expect(usuariosDAOMock.getAll).toHaveBeenCalled();
    expect(result).toEqual(users);
  });

  it("should get a user by ID", async () => {
    const user = {
      id: "1",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      role: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
      aud: "authenticated",
      created_at: new Date().toISOString(),
    };

    (usuariosDAOMock.getById as jest.Mock).mockResolvedValue(user);

    const result = await usuariosModel.getById("1");

    expect(usuariosDAOMock.getById).toHaveBeenCalledWith("1");
    expect(result).toEqual(user);
  });

  it("should update a user", async () => {
    const userUpdate: UsuarioUpdate = {
      firstName: "Updated",
      lastName: "User",
    };

    const updatedUser = {
      id: "1",
      email: "test@example.com",
      firstName: "Updated",
      lastName: "User",
      role: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
      aud: "authenticated",
      created_at: new Date().toISOString(),
    };

    (usuariosDAOMock.update as jest.Mock).mockResolvedValue(updatedUser);

    const result = await usuariosModel.update("1", userUpdate);

    expect(usuariosDAOMock.update).toHaveBeenCalledWith("1", userUpdate);
    expect(result).toEqual(updatedUser);
  });

  it("should delete a user", async () => {
    (usuariosDAOMock.delete as jest.Mock).mockResolvedValue(undefined);

    await usuariosModel.delete("1");

    expect(usuariosDAOMock.delete).toHaveBeenCalledWith("1");
  });
});
