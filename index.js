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
        console.log('USO: node index [accion] [parametros]; elija entre las acciones: "nuevo","rut","consulta","editar","eliminar"');
}
