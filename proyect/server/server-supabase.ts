import createApp from "@/src/app";
import EstadosModel from "@/src/estados/EstadosModel";
import EstadosSupabaseDAO from "@/src/estados/dao/EstadosSupabaseDAO";
import UsuariosModel from "@/src/usuarios/UsuariosModel";
import UsuariosSupabaseDAO from "@/src/usuarios/dao/UsuariosSupabaseDAO";

// Create the model instance with the DAO
const estadosModel = new EstadosModel( new EstadosSupabaseDAO());

const usuariosModel = new UsuariosModel(new UsuariosSupabaseDAO());

// Pass the model instance to createApp
createApp(estadosModel, usuariosModel);
