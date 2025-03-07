import createApp from "@/src/app";
import EstadosModel from "@/src/estados/EstadosModel";
import EstadosSupabaseDAO from "@/src/estados/dao/EstadosSupabaseDAO";

// Create the DAO instance
const estadosDAO = new EstadosSupabaseDAO();

// Create the model instance with the DAO
const estadosModel = new EstadosModel(estadosDAO);

// Pass the model instance to createApp
createApp(estadosModel);
