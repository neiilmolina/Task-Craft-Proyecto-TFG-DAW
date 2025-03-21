import createTiposRoute from "@/src/tipos/routesTipos";
import express from "express";
import request from "supertest";
import TiposModel from "@/src/tipos/TiposModel";
import { Tipo } from "@/src/tipos/interfacesTipos";

const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

describe("Estados Routes", () => {
  let app: express.Application;
  let mockTiposModel: any;

  beforeEach(() => {
    mockTiposModel = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    app = express();
    app.use(express.json());
    app.use("/tipos", createTiposRoute(mockTiposModel));
  });

  describe("GET /estados/:idEstado", () => {
  });
});
