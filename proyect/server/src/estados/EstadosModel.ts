// src/estados/EstadosModel.ts
import { Estado, EstadoNoId } from "./interfacesEstados";
import IEstadosDAO from "./dao/IEstadosDAO";

export default class EstadosModel {
  constructor(private estadosDAO: IEstadosDAO) {}

  async getAll(): Promise<Estado[]> {
    return this.estadosDAO.getAll();
  }

  async getById(id: number): Promise<Estado | null> {
    return this.estadosDAO.getById(id);
  }

  async create(estado: EstadoNoId): Promise<Estado | null> {
    return this.estadosDAO.create(estado);
  }

  async update(id: number, estado: EstadoNoId): Promise<Estado | null> {
    return this.estadosDAO.update(id, estado);
  }

  async delete(id: number): Promise<boolean> {
    return this.estadosDAO.delete(id);
  }
}
