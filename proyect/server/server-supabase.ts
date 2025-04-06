import createApp from "@/src/app";
import EstadosModel from "@/src/states/StatesRepository";
import EstadosSupabaseDAO from "@/src/states/dao/EstadosSupabaseDAO";
import UsuariosModel from "@/src/usuarios/UsuariosModel";
import UsuariosSupabaseDAO from "@/src/usuarios/dao/UsuariosSupabaseDAO";
import TiposModel from "./src/types/TiposModel";
import TiposSupabaseDAO from "./src/types/model/dao/TiposSupabaseDAO";

// Create the model instance with the DAO
const estadosModel = new EstadosModel(new EstadosSupabaseDAO());

const usuariosModel = new UsuariosModel(new UsuariosSupabaseDAO());

const tiposModel = new TiposModel(new TiposSupabaseDAO());
// Pass the model instance to createApp
// createApp(estadosModel, usuariosModel, tiposModel);
