import IDiariesDAO from "@/src/diaries/model/dao/IDiariesDAO";
import { UUID_REGEX } from "@/src/core/constants";
import { randomUUID } from "crypto";
import { RequestHandler } from "express";
import {
  DiaryFilters,
  validateDiaryCreate,
  validateDiaryFilters,
  validateDiaryUpdate,
} from "task-craft-models";
import DiariesRepository from "@/src/diaries/model/DiariesRepository";
import { DiaryCreate, DiaryUpdate } from "task-craft-models";

export default class DiariesController {
  private diariesRepository: DiariesRepository;

  constructor(diariesDAO: IDiariesDAO) {
    this.diariesRepository = new DiariesRepository(diariesDAO);
  }

  getDiaries: RequestHandler = async (req, res) => {
    try {
      const diariesFilters = (req.query as DiaryFilters) ?? undefined;

      const result = validateDiaryFilters(diariesFilters);
      if (!result.success) {
        res.status(400).json({
          error: "Error de validación en los filtros de diarios",
          details: result.errors?.map((error) => ({
            field: error.field,
            message: error.message,
          })),
        });
        return;
      }

      const diaries = await this.diariesRepository.getAll(diariesFilters);

      if (!diaries) {
        res.status(404).json({ error: "No se encontraron tareas" });
        return;
      }
      res.status(200).json(diaries);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }
  };

  getDiaryById: RequestHandler = async (req, res) => {
    try {
      const idDiary = req.params.idDiary;
      if (!UUID_REGEX.test(idDiary)) {
        res.status(400).json({ error: "El ID del user debe ser válido" });
        return;
      }

      const diary = await this.diariesRepository.getById(idDiary);

      if (!diary) {
        res.status(404).json({ error: "Diario no encontrado" });
        return;
      }

      res.status(200).json(diary);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }
  };

  createDiary: RequestHandler = async (req, res) => {
    try {
      const diaryData: DiaryCreate = req.body;

      const result = validateDiaryCreate(diaryData);
      if (!result.success) {
        res.status(400).json({
          error: "Error de validación",
          details: result.errors?.map((error) => ({
            field: error.field,
            message: error.message,
          })),
        });
        return;
      }
      const idDiary = randomUUID();
      if (!UUID_REGEX.test(idDiary)) {
        res.status(400).json({ error: "El ID del diary debe ser válido" });
        return;
      }

      const newDiary = await this.diariesRepository.create(idDiary, diaryData);

      if (!newDiary) {
        res.status(500).json({ error: "Error al crear la diario" });
        return;
      }

      res.status(200).json(newDiary);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  updateDiary: RequestHandler = async (req, res) => {
    try {
      const idDiary = req.params.idDiary;

      // Verificación de UUID
      if (!UUID_REGEX.test(idDiary)) {
        res.status(400).json({ error: "El ID del diario debe ser válido" });
        return;
      }

      const diaryData: DiaryUpdate = req.body;

      const result = validateDiaryUpdate(diaryData);
      if (!result.success) {
        res.status(400).json({
          error: "Error de validación",
          details: result.errors?.map((error) => ({
            field: error.field,
            message: error.message,
          })),
        });
        return;
      }

      const diaryUpdate = await this.diariesRepository.update(
        idDiary,
        diaryData
      );

      if (!diaryUpdate) {
        res.status(404).json({ error: "Diario no encontrada" });
        return;
      }

      res.status(200).json(diaryUpdate);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  deleteDiary: RequestHandler = async (req, res) => {
    try {
      const idDiary = req.params.idDiary;
      if (!UUID_REGEX.test(idDiary)) {
        res.status(400).json({ error: "El ID del diario debe ser válido" });
        return;
      }
      const diary = await this.diariesRepository.delete(idDiary);

      if (!diary) {
        res.status(404).json({ error: "Diario no encontrada" });
        return;
      }

      res.status(200).json(diary);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
}
