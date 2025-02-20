import express from 'express';
import dotenv from 'dotenv';
import pg from 'pg';

// Cargar variables de entorno
dotenv.config();

// Crear una nueva aplicación Express
const app = express();
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Definir un puerto para nuestro servidor
const port = process.env.PORT || 3000; // Usar process.env.PORT si está disponible

// Definir una ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Hola Mundo!');
});

app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    return res.json(result.rows); // Devuelve todos los usuarios
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

app.get('/buscar_usuario/cedula/:cedula', async (req, res) => {
  const { cedula } = req.params; // Obtener la cédula de los parámetros de la URL
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE cedula = $1', [cedula]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    return res.json(result.rows[0]); // Devuelve el usuario encontrado
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
