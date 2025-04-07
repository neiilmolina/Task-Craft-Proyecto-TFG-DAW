import { State, StateNoId } from "@/src/states/model/interfaces/interfacesStates";

export default interface IStatesDAO {
  getAll(): Promise<State[]>;
  getById(id: number): Promise<State | null>;
  create(state: StateNoId): Promise<State | null>;
  update(id: number, state: StateNoId): Promise<State | null>;
  delete(id: number): Promise<boolean>;
}
