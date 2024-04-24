// Conexión a BBDD Postgres

const { Pool } = require("pg");
const config = {
    host: "localhost",
    port: 5432,
    database: "estudiantes",
    user: "postgres",
    password: "XXXXXX" // Profe su clave acá
};
const pool = new Pool(config);
// se seleccionan los argumentos
const argumentos = process.argv.slice(2)
let accion = argumentos[0];

//1. Crear una función asíncrona para registrar un nuevo estudiante en la base de datos.(2 puntos)

/* insertar Alumno*/

const insertAlumno = async () => {
    let nombre = argumentos[1];
    let rut = argumentos[2];
    let curso = argumentos[3];
    let nivel = argumentos[4];
    try {
        const text = `insert into alumnos (nombre, rut, curso, nivel) values ($1, $2, $3, $4)`;
        const values = [nombre, rut, curso, nivel];
        await pool.query(text, values);
        console.log(`Estudiante ${nombre} agregado con éxito`);
    } catch (error) {
        console.log('Se ha producido el error', error);
    } finally {
        pool.end();
    }
};

// 2. Crear una función asíncrona para obtener por consola el registro de un estudiante por medio de su rut. (2 puntos)

/* Consultar por rut*/

const consultaRut = async () => {
    let rut = argumentos[1];
    try {
        const text = `select nombre,rut,curso,nivel from alumnos where rut='${rut}'`;
        const res = await pool.query(text);
        console.log(`Alumno:`, res.rows);
    } catch (error) {
        console.log('Se ha producido el error', error);
    } finally {
        pool.end();
    }
};

// 3. Crear una función asíncrona para obtener por consola todos los estudiantes registrados. (2 puntos)

/* Consultar Alumnos*/

const consultaAlumnos = async () => {
    try {
        const text = `select * from alumnos order by id`;
        const res = await pool.query(text);
        console.log(`Registro actual`, res.rows);
    } catch (error) {
        console.log('Se ha producido el error', error);
    } finally {
        pool.end();
    }
};

// 4. Crear una función asíncrona para actualizar los datos de un estudiante en la base de datos. (2 puntos)

/* modificar datos*/

const editaAlumno = async () => {
    let nombre = argumentos[1];
    let rut = argumentos[2];
    let curso = argumentos[3];
    let nivel = argumentos[4];
    try {
        const dataId = `select id from alumnos where rut='${rut}'`;
        const resId = await pool.query(dataId);
        const id = resId.rows[0].id;
        const text = `update alumnos set nombre='${nombre}',rut='${rut}',curso='${curso}',nivel=${nivel} where id=${id}`;
        await pool.query(text);
        console.log(`Estudiante ${nombre} actualizado/editado con éxito`);
    } catch (error) {
        console.log('Se ha producido el error', error);
    } finally {
        pool.end();
    }
};

// 5.- Crear una función asíncrona para eliminar el registro de un estudiante de la base de datos. (2 puntos)
/* eliminar datos*/
const eliminaAlumno = async () => {
    let rut = argumentos[1];
    console.log(rut);
    try {
        const dataId = `select id from alumnos where rut='${rut}'`;
        const resId = await pool.query(dataId);
        const id = parseInt(resId.rows[0].id);
        console.log(id);
        const text = `delete from alumnos where id = ${id}`;
        await pool.query(text);
        console.log(`Estudiante eliminado con éxito`);
    } catch (error) {
        console.log('Se ha producido el error', error);
    } finally {
        pool.end();
    }
};

// eleccion de la acción,
// USO: node index [accion] [parametros]

switch (accion) {
    case "nuevo":
        insertAlumno(); // [ 'nombre', 'rut', 'curso', nivel ]
        break;
    case "rut":
        consultaRut(); // [ 'rut' ]
        break;
    case "consulta":
        consultaAlumnos();
        break;
    case "editar":
        editaAlumno(); // [ 'nombre', 'rut', 'curso', nivel ]
        break;
    case "eliminar":
        eliminaAlumno();// [ 'rut' ]
        break;
    default:
        console.log('elija entre las acciones: "nuevo","rut","consulta","editar","eliminar"');
}
