import { TypeCreate, TypeUpdate } from "@/src/model/types/interfaces/interfacesTypes";
export declare function validateTypeCreate(input: Partial<TypeCreate>): {
    success: boolean;
    error: string;
} | {
    success: boolean;
    error?: undefined;
};
export declare function validateTypeUpdate(input: Partial<TypeUpdate>): {
    success: boolean;
    error: string;
} | {
    success: boolean;
    error?: undefined;
};
