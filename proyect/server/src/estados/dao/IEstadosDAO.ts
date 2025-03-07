// src/estados/dao/IEstadosDAO.ts - Define the interface
import { Estado, EstadoNoId } from "@/src/estados/interfacesEstados";

export default interface IEstadosDAO {
  getAll(): Promise<Estado[]>;
  getById(id: number): Promise<Estado | null>;
  create(estado: EstadoNoId): Promise<Estado | null>;
  update(id: number, estado: EstadoNoId): Promise<Estado | null>;
  delete(id: number): Promise<boolean>;
}
