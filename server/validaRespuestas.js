// Valida resultados, retornando el codigo de acuerdo al error dado.
function validaResultados(error, result, res) {
    if (error) {
        return res.status(500).send(error);
    }else if (result.length == 0) {
        return res.status(404).send("No hay resultados de la consulta");
    }
}

module.exports = {
    validaResultados: validaResultados
}