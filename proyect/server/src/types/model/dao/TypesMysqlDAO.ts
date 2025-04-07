import ITypesDAO from "@/src/types/model/dao/ITypesDAO";
import {
  Type,
  TypeCreate,
  TypeUpdate,
} from "@/src/types/model/interfaces/interfacesTypes";

// Constantes para los nombres de la tabla y los campos
const TABLE_NAME = "tipos";
const FIELDS = {
  idType: "idTipos",
  types: "Type",
  color: "color",
  idUser: "idusuario",
};

export default class TypesMysqlDAO implements ITypesDAO {
  getAll(idUser?: string): Promise<Type[] | null> {
    throw new Error("Method not implemented.");
  }
  getById(idType: number): Promise<Type | null> {
    throw new Error("Method not implemented.");
  }
  create(types: TypeCreate): Promise<Type | null> {
    throw new Error("Method not implemented.");
  }
  update(idType: number, types: TypeUpdate): Promise<Type | null> {
    throw new Error("Method not implemented.");
  }
  delete(idType: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
