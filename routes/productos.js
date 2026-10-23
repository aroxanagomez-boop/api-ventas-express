import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// GET /api/v1/productos
router.get('/', async (_req, res) => {
    try {
        const [resultSets] = await pool.query('CALL sp_listar_productos()');
        const productos = resultSets[0] || [];
        return res.status(200).json({
            status: 'success',
            total_registros: productos.length,
            data: productos
        });
    } catch (error) {
        console.error('Error en GET /api/v1/productos', error);
        return res.status(500).json({ error: 'Internal Server Error', message: 'Error en MySQL' });
    }
});

// POST /api/v1/productos
router.post('/', async (req, res) => {
    const { nombre_producto, precio_unitario } = req.body;
    const precio = Number(precio_unitario);

    if (typeof nombre_producto !== 'string' || !nombre_producto.trim() ||
        precio_unitario === undefined || precio_unitario === null || !Number.isFinite(precio) || precio <= 0) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'nombre_producto y precio_unitario (mayor que cero) son obligatorios'
        });
    }

    try {
        const [resultSets] = await pool.query('CALL sp_crear_producto(?, ?)', [nombre_producto.trim(), precio]);
        const producto = resultSets[0]?.[0] || { nombre_producto: nombre_producto.trim(), precio_unitario: precio };
        return res.status(201).json({
            status: 'created',
            message: 'Producto registrado exitosamente',
            data: producto
        });
    } catch (error) {
        console.error('Error en POST /api/v1/productos', error);
        return res.status(500).json({ error: 'Internal Server Error', message: 'Error en MySQL' });
    }
});

export default router;
