import express from 'express';
import ventasRoutes from './routes/ventas.js';
import productosRoutes from './routes/productos.js';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use('/api/v1/ventas', ventasRoutes);
app.use('/api/v1/productos', productosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Express en http://localhost:${PORT}`);
});
