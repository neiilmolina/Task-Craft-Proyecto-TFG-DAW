// src/estados/modelEstados.ts - Use the DAO in your model
import { Estado, EstadoNoId } from "@/src/estados/interfacesEstados";
import IEstadosDAO  from "./dao/IEstadosDAO";
import  EstadosSupabaseDAO from "@/src/estados/dao/EstadosSupabaseDAO";

export default class EstadosModel {
  private dao: IEstadosDAO;
  
  constructor(dao?: IEstadosDAO) {
    // Allow dependency injection for testing
    this.dao = dao || new EstadosSupabaseDAO();
  }

  async getAll() {
    return await this.dao.getAll();
  }

  async getById(id: number) {
    return await this.dao.getById(id);
  }

  async create(estado: EstadoNoId) {
    return await this.dao.create(estado);
  }
  
  async update(id: number, estadoData: EstadoNoId) {
    return await this.dao.update(id, estadoData);
  }
  
  async delete(id: number) {
    return await this.dao.delete(id);
  }
}