const express = require('express');
const Platillo = require('../../models/platillo');
const _ = require('underscore');
const app = express();


//|-------------Api GET Obtener los platillos por id---------------------|
//| Creada por: NNAV                                                     |
//| Fecha: 30/07/2020                                                    |
//| Api que obtiene/filtra platillos por categoria                       |
//| modificada por:                                                      |
//| Fecha de modificacion:                                               |
//| cambios:                                                             |
//| Ruta: http://localhost:3000/api/platillo/obtener/:idCategoria        |
//|----------------------------------------------------------------------|

app.get('/obtener/:idCategoria', (req, res) => {

    Platillo.find({ idCategoria: req.params.idCategoria }).then((platillos) => {
        if (platillos.length <= 0) {
            return res.status(404).json({
                ok: false,
                status: 404,
                msg: 'Esta categoría no tiene platillos registrados',
            });
        }
        return res.status(200).json({
            ok: true,
            status: 200,
            msg: 'Se han consultado correctamente los platillos',
            count: platillos.length,
            cont: platillos
        });
    }).catch((err) => {
        return res.status(400).json({
            ok: false,
            status: 400,
            msg: 'Error al obtener los platillos',
            err: Object.keys(err).length === 0 ? err.message : err
        });
    })
});

//|-------------Api GET Obtener los platillos por id---------------------|
//| Creada por: NNAV                                                     |
//| Fecha: 30/07/2020                                                    |
//| Api que obtiene/filtra platillos                                     |
//| modificada por:                                                      |
//| Fecha de modificacion:                                               |
//| cambios:                                                             |
//| Ruta: http://localhost:3000/api/platillo/obtener/:idPlatillo         |
//|----------------------------------------------------------------------|

app.get('/obtener/platillo/:idPlatillo', (req, res) => {
    let idPlatillo = req.params.idPlatillo;
    Platillo.find({ _id: idPlatillo }).then((platillo) => {

        if (platillo.length <= 0) {
            return res.status(404).json({
                ok: false,
                status: 404,
                msg: 'Este platillo no existe en la base de datos',
            });
        }
        return res.status(200).json({
            ok: true,
            status: 200,
            msg: 'Se han consultado correctamente el platillo',
            count: platillo.length,
            cont: platillo
        });
    }).catch((err) => {
        return res.status(400).json({
            ok: false,
            status: 400,
            msg: 'Error al obtener el platillo',
            err: Object.keys(err).length === 0 ? err.message : err
        });
    })
});
//|-------------Api POST Registrar una platillo--------------------------|
//| Creada por: NNAV                                                     |
//| Fecha: 31/07/2020                                                    |
//| Api que registra un platillo                                         |
//| modificada por:                                                      |
//| Fecha de modificacion:                                               |
//| cambios:                                                             |
//| Ruta: http://localhost:3000/api/platillo/registrar/:idCategoria      |
//|----------------------------------------------------------------------|

app.post('/registrar/:idCategoria', (req, res) => {

    let body = req.body;

    let strNombre = '';

    var regex = new RegExp(["^", body.strNombre, "$"].join(""), "i");

    Platillo.find({ 'strNombre': regex }).then((data) => {

        if (data.length > 0) {
            return res.status(400).json({
                ok: false,
                status: 400,
                msg: 'Esta platillo ya existe',
            });
        }

        strNombre = body.strNombre.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });

        let platillo = new Platillo({
            strNombre: strNombre,
            strDescripcion: body.strDescripcion,
            idCategoria: req.params.idCategoria,
            strIngredientes: body.strIngredientes,
            nmbPiezas: body.nmbPiezas,
            nmbPrecio: body.nmbPrecio,
            blnActivo: body.blnActivo
        });

        Platillo.findOne({ 'strNombre': strNombre }).then((encontrado) => {

            if (encontrado) {
                return res.status(400).json({
                    ok: false,
                    status: 400,
                    msg: 'Este platillo ya existe'
                });
            }

            platillo.save().then((platilloDB) => {
                return res.status(200).json({
                    ok: true,
                    resp: 200,
                    msg: 'Se ha registrado correctamente el platillo',
                    cont: platilloDB
                });
            }).catch((err) => {
                return res.status(400).json({
                    ok: false,
                    resp: 400,
                    msg: 'Error al registrar el platillo',
                    err: Object.keys(err).length === 0 ? err.message : err
                });
            })
        });

    }).catch((err) => {
        return res.status(500).json({
            ok: false,
            status: 400,
            msg: 'Ha ocurrido un error con el servidor',
            err: Object.keys(err).length === 0 ? err.message : err
        });
    });
});

//|-------------Api PUT Modificar un platillo----------------------------|
//| Creada por: NNAV                                                     |
//| Fecha: 31/07/2020                                                    |
//| Api que modifica una platillo                                        |
//| modificada por:                                                      |
//| Fecha de modificacion:                                               |
//| cambios:                                                             |
//| Ruta: http://localhost:3000/api/platillo/modificar/:idPlatillo       |
//|----------------------------------------------------------------------|

app.put('/modificar/:idPlatillo', (req, res) => {
    let id = req.params.idPlatillo;

    let body = _.pick(req.body, ['strNombre', 'strDescripcion', 'strIngredientes', 'nmbPiezas', 'nmbPrecio', 'blnActivo']);

    var regex = new RegExp(["^", body.strNombre, "$"].join(""), "i");

    Platillo.find({ 'strNombre': regex, 'strDescripcion': body.strDescripcion, 'strIngredientes': body.strIngredientes, 'nmbPiezas': body.nmbPiezas, 'nmbPrecio': body.nmbPrecio, 'blnActivo': body.blnActivo }).then((data) => {

        if (data.length > 0) {
            return res.status(400).json({
                ok: false,
                status: 400,
                msg: 'Este platillo ya existe',
            });
        }


        Platillo.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }).then((platilloDB) => {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'La respuesta se ha actualizado exitosamente.',
                cont: platilloDB
            });
        }).catch((err) => {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error al intentar actualizar el platillo',
                err: Object.keys(err).length === 0 ? err.message : err
            });
        })

    }).catch((err) => {
        return res.status(500).json({
            ok: false,
            status: 400,
            msg: 'Ha ocurrido un error con el servidor',
            err: Object.keys(err).length === 0 ? err.message : err
        });
    });
});

//|-------------Api DELETE Desactivar una platillo-----------------------|
//| Creada por: NNAV                                                     |
//| Fecha: 30/07/2020                                                    |
//| Api que desactiva un platillo                                        |
//| modificada por:                                                      |
//| Fecha de modificacion:                                               |
//| cambios:                                                             |
//| Ruta: http://localhost:3000/api/platillo/eliminar/:idPlatillo        |
//|----------------------------------------------------------------------|

app.delete('/eliminar/:idPlatillo', (req, res) => {
    let id = req.params.idPlatillo;

    Platillo.findByIdAndUpdate(id, { blnActivo: false }, { new: true, runValidators: true, context: 'query' }).then((resp) => {
        return res.status(200).json({
            ok: true,
            status: 200,
            msg: 'Se ha desactivado correctamente el platillo',
            cont: resp
        });
    }).catch((err) => {
        return res.status(400).json({
            ok: false,
            status: 400,
            msg: 'Error al desactivar el platillo',
            err: Object.keys(err).length === 0 ? err.message : err
        });
    })
});
//|-------------Api PUT Activar un platillo -----------------------------|
//| Creada por: NNAV                                                     |
//| Fecha: 31/07/2020                                                    |
//| Api que activa un platillo                                           |
//| modificada por:                                                      |
//| Fecha de modificacion:                                               |
//| cambios:                                                             |
//| Ruta: http://localhost:3000/api/platillo/activar/:idPlatillo         |
//|----------------------------------------------------------------------|

app.delete('/activar/:idPlatillo', (req, res) => {
    let id = req.params.idPlatillo;

    Platillo.findByIdAndUpdate(id, { blnActivo: true }, { new: true, runValidators: true, context: 'query' }).then((resp) => {
        return res.status(200).json({
            ok: true,
            status: 200,
            msg: 'Se ha activado correctamente el platillo',
            cont: resp
        });
    }).catch((err) => {
        return res.status(400).json({
            ok: false,
            status: 400,
            msg: 'Error al activar el plaatillo',
            err: Object.keys(err).length === 0 ? err.message : err
        });
    })
});

module.exports = app;