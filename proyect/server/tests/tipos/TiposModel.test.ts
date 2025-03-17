import supabase from "@/tests/__mocks__/supabase";
import TiposModel from "@/src/tipos/TiposModel";
import ITiposDAO from "@/src/tipos/dao/ITiposDAO";
import { Tipo, TipoCreate, TipoUpdate } from "@/src/tipos/interfacesTipos";

jest.mock("@/config/supabase", () => ({
  __esModule: true,
  default: supabase,
}));

describe("EstadosModel", () => {});
