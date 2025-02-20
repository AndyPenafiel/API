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

// Ruta para eliminar un usuario por cédula
app.delete('/delete_usuario/:cedula', async (req, res) => {
  const { cedula } = req.params; // Obtenemos la cédula del usuario a eliminar
  try {
    // Realizamos la consulta para eliminar el usuario en la base de datos
    const result = await pool.query('DELETE FROM usuarios WHERE cedula = $1', [cedula]);
    
    // Verificamos si el usuario fue encontrado y eliminado
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});




// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
