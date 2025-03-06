import { validateEstado } from "@/src/estados/schemasEstados";

export default class EstadosController {
  constructor(private estadosModel: any) {
    this.estadosModel = estadosModel;
  }

  getEstados = async (_: any, res: any) => {
    try {
      const estados = await this.estadosModel.selectAllEstados();
      res.json(estados);
    } catch (e) {
      console.error("Error al cargar los estados:", e);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  getEstadoById = async (req: any, res: any) => {
    try {
      const { idEstado } = req.params;
      const estado = await this.estadosModel.selectEstadoById({ idEstado });
      if (estado) {
        res.json(estado);
      } else {
        res.status(404).json({ message: "Diario no encontrado" });
      }
    } catch (error) {
      console.error("Error al cargar el estado:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  createEstado = async (req: any, res: any) => {
    try {
      const { idEstado, estado } = req.body;
      const result = validateEstado({ idEstado: idEstado, estado: estado });
      if (!result.success) return res.status(400).json({ error: result.error });

      const newEstado = await this.estadosModel.insertEstado(estado);
      res.json(newEstado);
    } catch (error) {
      console.error("Error al crear el estado:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  deleteEstado = async (req: any, res: any) => {
    try {
      const { idEstado } = req.params;
      const deletedEstado = await this.estadosModel.deleteEstado({ idEstado });
      res.json(deletedEstado);
    } catch (error) {
      console.error("Error al eliminar el estado:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  updateEstado = async (req: any, res: any) => {
    try {
      const { idEstado, estado } = req.body;
      const result = validateEstado({ idEstado: idEstado, estado: estado });
      if (!result.success) return res.status(400).json({ error: result.error });

      const updatedEstado = await this.estadosModel.updateEstado({
        idEstado: idEstado,
        estado: estado,
      });
      res.json(updatedEstado);
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
}
