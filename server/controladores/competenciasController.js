var con = require('../lib/conexionbd');
var validador = require('../validaRespuestas');

// Retorna todas las competencias existentes.
function buscarCompetencias(req, res) {
    con.query('select * from competencia', function (error, result, fields) {
        validador.validaResultados(error, result, res);
        res.send(JSON.stringify(result));
    })
};

// Retorna 2 peliculas aleatoriamente.
function busquedaAleatoriaDePeliculas(req, res) {
    var id = req.params.id !== undefined ? req.params.id : "";
    var sqlCompetencia = "select * from competencia where id = ?";
    var response = {
        'peliculas': "",
        'competencia': ""
    }
    con.query(sqlCompetencia, [id] , function (error, result, fields) {
        validador.validaResultados(error, result);
        response.competencia = result[0].nombre;
        var genero = result[0].genero_id;
        var director = result[0].director_id;
        var actor = result[0].actor_id;
        var sql = "select distinct p.genero_id, p.id, p.poster, p.titulo from pelicula p inner join genero g on p.genero_id = g.id inner join director_pelicula dp on p.id = dp.pelicula_id inner join actor_pelicula ap on p.id = ap.pelicula_id where p.genero_id = p.genero_id";
        var sqlGenero = genero ? " and p.genero_id = " + genero : "";
        var sqlDirector = director ? " and dp.director_id = " + director : "";
        var sqlActor = actor ? " and ap.actor_id = " + actor : "";
        var sqlOrdenamiento = " order by rand() limit 2";
        var sqlFinal = sql + sqlGenero + sqlDirector + sqlActor + sqlOrdenamiento;
        con.query(sqlFinal, function (error, result, fields) {
            // Valida que la consulta retorne al menos 2 peliculas.
            if (result.length < 2) {
                return res.status(422).json("Deben existir al menos 2 peliculas para realizar la votación");
            }
            validador.validaResultados(error, result, res);
            response.peliculas = result;
            res.send(JSON.stringify(response));
        })
    })
};

// Retorna las peliculas más votadas de la competencia dada.
function buscarPelisMasVotadas(req, res) {
    var id = req.params.id !== undefined ? req.params.id : "";
    var sqlCompetencia = "select * from competencia where id = ?";
    var response = {
        'resultados': "",
        'competencia': ""
    }
    con.query(sqlCompetencia, [id], function (error, result, fields) {
        validador.validaResultados(error, result, res);
        response.competencia = result[0].nombre;
        var sql = "select v.pelicula_id, p.poster, p.titulo, count(v.pelicula_id) as votos from voto v inner join pelicula p on v.pelicula_id = p.id where v.competencia_id = ? group by v.pelicula_id order by votos desc limit 3"
        con.query(sql, [id], function (error, result, fields) {
            validador.validaResultados(error, result, res);
            response.resultados = result;
            res.send(JSON.stringify(response));
        })
    })
}

// Inserta los votos realizados desde el front.
function votarPelicula(req, res) {
    var idCompetencia = req.params.idCompetencia !== undefined ? req.params.idCompetencia : null;
    var idPelicula = req.body.idPelicula !== undefined ? req.body.idPelicula : null;
    var sqlVoto = "insert into `voto` (`pelicula_id`, `competencia_id`) values (?, ?)";

    con.query(sqlVoto, [idPelicula, idCompetencia], function (error, result, fields) {
        validador.validaResultados(error, result, res)
        var response = {
            'voto': result,
        };
        res.status(200).send(response);
    })
}

// Crea nueva competencia.
function crearCompetencia(req, res) {
    // Datos recibidos desde el front
    var nombre = req.body.nombre === '' ? res.status(422).json("Debe ingresar un nombre"): req.body.nombre;
    var genero = req.body.genero === '0' ? null : req.body.genero;
    var director = req.body.director === '0' ? null : req.body.director;
    var actor = req.body.actor === '0' ? null : req.body.actor;
    // Consultas
    var sqlCompetencia = "select nombre from `competencia` where nombre = ?";
    var sql = "insert into `competencia` (`nombre`, `genero_id`, `director_id`, `actor_id`) values ( ?, ?, ?, ?)";
    con.query(sqlCompetencia, [nombre], function (error, result, fields) {
        // Valida si ya existe una competencia con el nombre dado.
        if (result.length !== 0) {
            return res.status(422).json("Ya existe una competencia con el nombre " + nombre);
        }
        con.query(sql, [nombre, genero, director, actor], function (error, result, fields) {
            validador.validaResultados(error, result, res);
            res.send(JSON.stringify(result));
        })
    })
}

// Elimina todos los votos de unq competencia.
function eliminarVotos(req, res) {
    var idCompetencia = req.params.id;
    var sqlCompetencia = "select id from competencia where id = ?";
    var sqlDelete = "delete from voto where competencia_id = ?";

    con.query(sqlCompetencia, [idCompetencia], function (error, result, fields) {
        validador.validaResultados(error, result, res);
        con.query(sqlDelete, [idCompetencia], function (error, result, fields) {
            validador.validaResultados(error, result, res);
            res.send(JSON.stringify(result));
        })
    })
}

// Agrega la Opcion de crear competencias por género.
function crearCompetenciasPorGenero(req, res) {
    var sql = "select * from genero"
    con.query(sql, function (error, result, fields) {
        validador.validaResultados(error, result, res);
        res.send(JSON.stringify(result));
    })
}

// Agrega la Opcion de crear competencias por director/a.
function crearCompetenciasPorDirector(req, res) {
    var sql = "select * from director"
    con.query(sql, function (error, result, fields) {
        validador.validaResultados(error, result, res);
        res.send(JSON.stringify(result));
    })
}

// Agrega la Opcion de crear competencias por director/a.
function crearCompetenciasPorActor(req, res) {
    var sql = "select * from actor"
    con.query(sql, function (error, result, fields) {
        validador.validaResultados(error, result, res);
        res.send(JSON.stringify(result));
    })
}

function eliminarCompetencia(req, res) {
    var idCompetencia = req.params.idCompetencia;
    // Baja física en Cascada.
    var sqlEliminaVotos = "delete from voto where competencia_id = ?";
    var sqlEliminaCompetencia = "delete from competencia where id = ?";
    con.query(sqlEliminaVotos, [idCompetencia], function (error, result, fields) {
        validador.validaResultados(error, result, res);
        con.query(sqlEliminaCompetencia, [idCompetencia], function (error, result, fields) {
            validador.validaResultados(error, result, res);
            res.send(JSON.stringify(result));
        })
    })
}

function editarCompetencia(req, res) {
    var nombre = req.body.nombre ? req.body.nombre : "";
    var idCompetencia = req.params.idCompetencia;
    var sqlEditar = "update competencia set nombre = ? where id = ?";
    con.query(sqlEditar, [nombre, idCompetencia], function (error, result, fields) {
        validador.validaResultados(error, result, res);
        var response = {
            'id': result
        }
        res.send(JSON.stringify(response));
    })
}

// exporto funciones del controller para poder ser utilizado por otra clase.
module.exports = {
    buscarCompetencias: buscarCompetencias,
    busquedaAleatoriaDePeliculas: busquedaAleatoriaDePeliculas,
    buscarPelisMasVotadas: buscarPelisMasVotadas,
    votarPelicula: votarPelicula,
    crearCompetencia: crearCompetencia,
    eliminarVotos: eliminarVotos,
    crearCompetenciasPorGenero: crearCompetenciasPorGenero,
    crearCompetenciasPorDirector: crearCompetenciasPorDirector,
    crearCompetenciasPorActor: crearCompetenciasPorActor,
    eliminarCompetencia: eliminarCompetencia,
    editarCompetencia: editarCompetencia
}