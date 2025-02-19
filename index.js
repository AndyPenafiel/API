import express from 'express';
import dotenv from 'dotenv';
import pg from 'pg';

// Cargar variables de entorno
dotenv.config();

// Crear una nueva aplicación Express
const app = express();
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Asegúrate de que este valor sea adecuado para tu configuración
  }
});

// Definir un puerto para nuestro servidor
const port = process.env.PORT || 3000; // Usar process.env.PORT si está disponible

// Definir una ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Hola Mundo!');
});

app.get('/ping', async (req, res) => {
  const result = await pool.query('SELECT NOW()');
  return res.json(result.rows[0]); // Usar 'rows' en lugar de 'row'
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
