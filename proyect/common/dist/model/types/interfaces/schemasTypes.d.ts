import { TypeCreate, TypeUpdate } from "./interfacesTypes";
export declare function validateTypeCreate(input: Partial<TypeCreate>): {
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
export declare function validateTypeUpdate(input: Partial<TypeUpdate>): {
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
