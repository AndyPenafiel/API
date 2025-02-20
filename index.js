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

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

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
    const result = await pool.query(`SELECT * FROM usuarios WHERE cedula = '${cedula}'`);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    return res.json(result.rows[0]); // Devuelve el usuario encontrado
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});

app.post('/crear_usuario', async (req, res) => {
  const { cedula, nombre, email } = req.body; // Suponiendo que los datos se envían en el cuerpo de la solicitud
  try {
    const result = await pool.query(`
      INSERT INTO usuarios (cedula, nombre, email) 
      VALUES ('${cedula}', '${nombre}', '${email}')
      RETURNING *`);
    
    return res.status(201).json(result.rows[0]); // Devuelve el usuario creado
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

app.put('/actualizar_usuario/cedula/:cedula', async (req, res) => {
  const { cedula } = req.params; // Obtener la cédula de los parámetros de la URL
  const { nombre, email } = req.body; // Obtener los nuevos datos del cuerpo de la solicitud
  
  try {
    const result = await pool.query(`
      UPDATE usuarios 
      SET nombre = '${nombre}', email = '${email}' 
      WHERE cedula = '${cedula}' 
      RETURNING *`);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    return res.json(result.rows[0]); // Devuelve el usuario actualizado
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

app.delete('/eliminar_usuario/cedula/:cedula', async (req, res) => {
  const { cedula } = req.params; // Obtener la cédula de los parámetros de la URL
  
  try {
    const result = await pool.query(`
      DELETE FROM usuarios 
      WHERE cedula = '${cedula}' 
      RETURNING *`);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    return res.status(200).json({ message: 'Usuario eliminado' }); // Devuelve un mensaje de confirmación
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
