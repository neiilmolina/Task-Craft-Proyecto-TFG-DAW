import { State, StateNoId } from "@/src/states/model/interfaces/interfacesStates";
import IStatesDAO from "@/src/states/model/dao/IStatesDAO";

export default class StatesRepository {
  constructor(private statesDAO: IStatesDAO) {}

  async getAll(): Promise<State[]> {
    return this.statesDAO.getAll();
  }

  async getById(id: number): Promise<State | null> {
    return this.statesDAO.getById(id);
  }

  async create(state: StateNoId): Promise<State | null> {
    return this.statesDAO.create(state);
  }

  async update(id: number, state: StateNoId): Promise<State | null> {
    return this.statesDAO.update(id, state);
  }

  async delete(id: number): Promise<boolean> {
    return this.statesDAO.delete(id);
  }
}
