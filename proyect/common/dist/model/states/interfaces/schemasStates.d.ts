import { z } from "zod";
import { State, StateNoId } from "@/src/model/states/interfaces/interfacesStates";
export declare function validateState(input: Partial<State>): z.SafeParseReturnType<{
    state: string;
    idState?: number | undefined;
}, {
    state: string;
    idState?: number | undefined;
}>;
export declare function validateStateNoId(input: Partial<StateNoId>): z.SafeParseReturnType<{
    state: string;
}, {
    state: string;
}>;
