import express from 'express';
import mysql from 'mysql2/promise';
import 'dotenv/config';

const app = express();

// 1.middleware para procesar req.body
app.use(express.json());

// 2. Conexión a mySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

// 3. Endpoints GET: Consultar consolidado de ventas con parámetro
app.get('/api/v1/ventas/consolidado', async (req, res) => {
    try {
        const {sucursal, anio} = req.query;

        //Validacion de parámetros obligatorios
        if (!sucursal || !anio) {
            return  res.status(400).json({
                error: 'Bad Request',
                message: 'Debe enviar ambos parámetros'
                });
        }

        const [rows] = await pool.query('CALL db_ventas_tech(?, ?)', [sucursal, anio]);

        //enviar la respuesta al cliente
        res.status(200).json(
           {status: 'success',
            total_registros: rows[0] ? rows[0].length : 0,
            data: rows[0]}
        );

    } catch (error) {
        console.error('Error en GET /ventas/consolidado', error);
        res.status(500).json({ error: 'Internal Server Error', message: 'Error en MySQL' });
    }
});

// 4. Endpoint POST: ingresar nueva venta

app.post('/api/v1/ventas', async (req, res) => {
    try {
        const {id_producto, id_cliente, cantidad, fecha_venta} = req.body;

        //validacion de datos
        if (!id_producto || !id_cliente || !cantidad || !fecha_venta) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Todos los parametros son obligatorios'
            });
        }

        // Inserta datos en la BD
        await pool.query('CALL  db_registrar_venta(?, ?, ?, ?)', [
            id_producto, id_cliente, cantidad, fecha_venta
        ]);

        res.status(201).json({
            status: 'created',
            message: 'Venta registrada exitosamente',
            datos_registrados: {id_producto, id_cliente, cantidad, fecha_venta}
        });

    } catch (error) {
        console.error('Error en POST /ventas', error);
        res.status(500).json({ error: 'Internal Server Error', message: 'Error al insertar venta' });
    }
});

// 5. Iniciar el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor express ejecutandose en http://localhost:${PORT}`);
}); 