require('dotenv').config();

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var competenciaController = require('./controladores/competenciasController');
var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// Seteamos las rutas ordenadas de mas a menos especificas.
app.get('/generos', competenciaController.crearCompetenciasPorGenero);
app.get('/directores', competenciaController.crearCompetenciasPorDirector);
app.get('/actores', competenciaController.crearCompetenciasPorActor);
app.get('/competencias', competenciaController.buscarCompetencias);
app.post('/competencias', competenciaController.crearCompetencia);
app.get('/competencias/:id/peliculas', competenciaController.busquedaAleatoriaDePeliculas);
app.get('/competencias/:id/resultados', competenciaController.buscarPelisMasVotadas);
app.post('/competencias/:idCompetencia/voto', competenciaController.votarPelicula);
app.put('/competencias/:idCompetencia', competenciaController.editarCompetencia);
app.delete('/competencias/:id/votos', competenciaController.eliminarVotos);
app.delete('/competencias/:idCompetencia', competenciaController.eliminarCompetencia);

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación.
var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});