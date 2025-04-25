import { z } from "zod";
import { Role, RoleNoId } from "./interfacesRoles";
export declare const roleSchema: z.ZodObject<{
    idRole: z.ZodOptional<z.ZodNumber>;
    role: z.ZodString;
}, "strip", z.ZodTypeAny, {
    role: string;
    idRole?: number | undefined;
}, {
    role: string;
    idRole?: number | undefined;
}>;
export declare function validateRole(input: Partial<Role>): {
    success: false;
    errors: {
        field: string;
        message: string;
        code: string;
    }[];
} | {
    success: true;
    data: any;
};
export declare function validateRoleNoId(input: Partial<RoleNoId>): {
    success: false;
    errors: {
        field: string;
        message: string;
        code: string;
    }[];
} | {
    success: true;
    data: any;
};
