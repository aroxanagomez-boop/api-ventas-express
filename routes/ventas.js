import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/consolidado', async (req, res) => {
    try {
        const { sucursal, anio } = req.query;
        if (!sucursal || !anio) {
            return res.status(400).json({ error: 'Bad Request', message: 'Debe enviar ambos parámetros' });
        }
        const [rows] = await pool.query('CALL db_ventas_tech(?, ?)', [sucursal, anio]);
        const data = rows[0] || [];
        return res.status(200).json({ status: 'success', total_registros: data.length, data });
    } catch (error) {
        console.error('Error en GET /api/v1/ventas/consolidado', error);
        return res.status(500).json({ error: 'Internal Server Error', message: 'Error en MySQL' });
    }
});

router.get('/por-id', async (req, res) => {
    try {
        const { idVenta } = req.query;
        if (!idVenta) {
            return res.status(400).json({ error: 'Bad Request', message: 'El parámetro idVenta es obligatorio' });
        }
        const [rows] = await pool.query('CALL sp_venta_id(?)', [idVenta]);
        const data = rows[0] || [];
        return res.status(200).json({ status: 'success', total_registros: data.length, data });
    } catch (error) {
        console.error('Error en GET /api/v1/ventas/por-id', error);
        return res.status(500).json({ error: 'Internal Server Error', message: 'Error en MySQL' });
    }
});

router.post('/', async (req, res) => {
    const { id_producto, id_cliente, cantidad, fecha_venta } = req.body;
    if (!id_producto || !id_cliente || !cantidad || !fecha_venta) {
        return res.status(400).json({ error: 'Bad Request', message: 'Todos los parámetros son obligatorios' });
    }
    try {
        await pool.query('CALL db_registrar_venta(?, ?, ?, ?)', [id_producto, id_cliente, cantidad, fecha_venta]);
        return res.status(201).json({
            status: 'created',
            message: 'Venta registrada exitosamente',
            datos_registrados: { id_producto, id_cliente, cantidad, fecha_venta }
        });
    } catch (error) {
        console.error('Error en POST /api/v1/ventas', error);
        return res.status(500).json({ error: 'Internal Server Error', message: 'Error en MySQL' });
    }
});

export default router;
