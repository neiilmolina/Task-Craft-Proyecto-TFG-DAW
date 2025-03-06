// src/estados/__tests__/estadosRoutes.test.ts

import createEstadosRoute from '@/src/estados/routesEstados';
import express from 'express';
import request from 'supertest';

describe('Estados Routes', () => {
  let app: express.Application;
  let mockEstadosModel: any;

  beforeEach(() => {
    mockEstadosModel = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    app = express();
    app.use(express.json());
    app.use('/api', createEstadosRoute(mockEstadosModel));
  });

  describe('GET /api/estados', () => {
    it('debería devolver todos los estados', async () => {
      const mockEstados = [{ id: 1, nombre: 'Activo' }, { id: 2, nombre: 'Inactivo' }];
      mockEstadosModel.getAll.mockResolvedValue(mockEstados);

      const response = await request(app).get('/api/estados');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEstados);
      expect(mockEstadosModel.getAll).toHaveBeenCalled();
    });

    it('debería manejar errores al obtener estados', async () => {
      mockEstadosModel.getAll.mockRejectedValue(new Error('Error al obtener estados'));

      const response = await request(app).get('/api/estados');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/estados/:id', () => {
    it('debería devolver un estado por ID', async () => {
      const mockEstado = { id: 1, nombre: 'Activo' };
      mockEstadosModel.getById.mockResolvedValue(mockEstado);

      const response = await request(app).get('/api/estados/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEstado);
      expect(mockEstadosModel.getById).toHaveBeenCalledWith('1');
    });

    it('debería devolver 404 si el estado no existe', async () => {
      mockEstadosModel.getById.mockResolvedValue(null);

      const response = await request(app).get('/api/estados/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Estado no encontrado');
    });

    it('debería manejar errores al obtener un estado por ID', async () => {
      mockEstadosModel.getById.mockRejectedValue(new Error('Error al obtener estado'));

      const response = await request(app).get('/api/estados/1');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/estados', () => {
    it('debería crear un nuevo estado correctamente', async () => {
      const nuevoEstado = { nombre: 'En proceso' };
      const estadoCreado = { id: 3, nombre: 'En proceso' };
      mockEstadosModel.create.mockResolvedValue(estadoCreado);

      const response = await request(app)
        .post('/api/estados')
        .send(nuevoEstado)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toEqual(estadoCreado);
      expect(mockEstadosModel.create).toHaveBeenCalledWith(nuevoEstado);
    });

    it('debería manejar errores al crear un estado', async () => {
      const nuevoEstado = { nombre: 'En proceso' };
      mockEstadosModel.create.mockRejectedValue(new Error('Error al crear estado'));

      const response = await request(app)
        .post('/api/estados')
        .send(nuevoEstado)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });

    it('debería validar datos de entrada', async () => {
      const estadoInvalido = {}; // Sin nombre
      
      const response = await request(app)
        .post('/api/estados')
        .send(estadoInvalido)
        .set('Content-Type', 'application/json');

      // Asumiendo que hay validación en el controlador
      expect(response.status).toBe(400);
      expect(mockEstadosModel.create).not.toHaveBeenCalled();
    });
  });

  describe('PUT /api/estados/:id', () => {
    it('debería actualizar un estado correctamente', async () => {
      const estadoActualizado = { nombre: 'Completado' };
      const resultadoActualizado = { id: 1, nombre: 'Completado' };
      mockEstadosModel.update.mockResolvedValue(resultadoActualizado);
      mockEstadosModel.getById.mockResolvedValue({ id: 1, nombre: 'Activo' }); // El estado existe

      const response = await request(app)
        .put('/api/estados/1')
        .send(estadoActualizado)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(resultadoActualizado);
      expect(mockEstadosModel.update).toHaveBeenCalledWith('1', estadoActualizado);
    });

    it('debería devolver 404 si el estado a actualizar no existe', async () => {
      const estadoActualizado = { nombre: 'Completado' };
      mockEstadosModel.getById.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/estados/999')
        .send(estadoActualizado)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Estado no encontrado');
      expect(mockEstadosModel.update).not.toHaveBeenCalled();
    });

    it('debería manejar errores al actualizar un estado', async () => {
      const estadoActualizado = { nombre: 'Completado' };
      mockEstadosModel.getById.mockResolvedValue({ id: 1, nombre: 'Activo' });
      mockEstadosModel.update.mockRejectedValue(new Error('Error al actualizar estado'));

      const response = await request(app)
        .put('/api/estados/1')
        .send(estadoActualizado)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/estados/:id', () => {
    it('debería eliminar un estado correctamente', async () => {
      mockEstadosModel.getById.mockResolvedValue({ id: 1, nombre: 'Activo' });
      mockEstadosModel.delete.mockResolvedValue({ success: true });

      const response = await request(app).delete('/api/estados/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(mockEstadosModel.delete).toHaveBeenCalledWith('1');
    });

    it('debería devolver 404 si el estado a eliminar no existe', async () => {
      mockEstadosModel.getById.mockResolvedValue(null);

      const response = await request(app).delete('/api/estados/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Estado no encontrado');
      expect(mockEstadosModel.delete).not.toHaveBeenCalled();
    });

    it('debería manejar errores al eliminar un estado', async () => {
      mockEstadosModel.getById.mockResolvedValue({ id: 1, nombre: 'Activo' });
      mockEstadosModel.delete.mockRejectedValue(new Error('Error al eliminar estado'));

      const response = await request(app).delete('/api/estados/1');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });
});
