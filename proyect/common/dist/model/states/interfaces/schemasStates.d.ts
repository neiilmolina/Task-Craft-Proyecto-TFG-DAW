import { State, StateNoId } from "./interfacesStates";
export declare function validateState(input: Partial<State>): {
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
export declare function validateStateNoId(input: Partial<StateNoId>): {
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
