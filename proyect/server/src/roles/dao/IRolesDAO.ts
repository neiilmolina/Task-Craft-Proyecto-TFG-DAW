import { Rol, RolNoId } from "@/src/roles/interfacesRoles";

export default interface IRolesDAO {
  getAll(): Promise<Rol[]>;
  getById(id: number): Promise<Rol | null>;
  create(role: RolNoId): Promise<Rol>;
  update(id: number, role: RolNoId): Promise<Rol>;
  delete(id: number): Promise<boolean>;
}
