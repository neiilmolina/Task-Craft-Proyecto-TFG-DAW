import { Role, RoleNoId } from "@/src/roles/model/interfaces/interfacesRoles";

export default interface IRolesDAO {
  getAll(): Promise<Role[]>;
  getById(id: number): Promise<Role | null>;
  create(role: RoleNoId): Promise<Role | null>;
  update(id: number, role: RoleNoId): Promise<Role | null>;
  delete(id: number): Promise<boolean>;
}
