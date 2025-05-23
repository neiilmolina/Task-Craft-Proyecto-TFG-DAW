import { State, StateNoId } from "task-craft-models"

export default interface IStatesDAO {
  getAll(): Promise<State[]>;
  getById(id: number): Promise<State | null>;
  create(state: StateNoId): Promise<State | null>;
  update(id: number, state: StateNoId): Promise<State | null>;
  delete(id: number): Promise<boolean>;
}
