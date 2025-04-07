import {
  Type,
  TypeCreate,
  TypeUpdate,
} from "@/src/types/model/interfaces/interfacesTypes";

export default interface ITypesDAO {
  getAll(idUsuario?: string): Promise<Type[] | null>;

  getById(idType: number): Promise<Type | null>;

  create(type: TypeCreate): Promise<Type | null>;

  update(idType: number, type: TypeUpdate): Promise<Type | null>;

  delete(idType: number): Promise<boolean>;
}
