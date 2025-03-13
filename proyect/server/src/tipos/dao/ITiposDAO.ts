import { Tipo, TipoCreate, TipoUpdate } from "@/src/tipos/interfacesTipos";

export default interface ITiposDAO {
  getAll(idUsuario?: string): Promise<Tipo[] | null>;

  getById(idTipo: number): Promise<Tipo | null>;

  create(tipo: TipoCreate): Promise<Tipo | null>;

  update(idTipo: number, tipo: TipoUpdate): Promise<Tipo | null>;

  delete(idTipo: number): Promise<boolean>;
}
