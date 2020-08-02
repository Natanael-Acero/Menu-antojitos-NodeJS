const express = require('express');
const Categoria = require('../../models/categoria');
const _ = require('underscore');
const app = express();


//|-------------Api GET Obtener Categorias-------------------------------|
//| Creada por: NNAV                                                     |
//| Fecha: 31/07/2020                                                    |
//| Api que obtiene las categorias                                       |
//| modificada por:                                                      |
//| Fecha de modificacion:                                               |
//| cambios:                                                             |
//| Ruta: http://localhost:3000/api/categoria/obtener                    |
//|----------------------------------------------------------------------|

app.get('/obtener', (req, res) => {
    Categoria.find().then((categorias) => {

        if (categorias.length <= 0) {
            return res.status(404).json({
                ok: false,
                status: 404,
                msg: 'No existen categorias registradas',
            });
        }

        return res.status(200).json({
            ok: true,
            status: 200,
            msg: 'Se han obtenido correctamente las categorias',
            count: categorias.length,
            cont: categorias
        });

    }).catch((err) => {
        return res.status(400).json({
            ok: false,
            status: 400,
            msg: 'Error al intenar obtener las categorias',
            err: Object.keys(err).length === 0 ? err.message : err
        });
    })
});


//|-------------Api GET Obtener una categoria por id---------------------|
//| Creada por: NNAV                                                     |
//| Fecha: 30/07/2020                                                    |
//| Api que obtiene/filtra una categoria por id                          |
//| modificada por:                                                      |
//| Fecha de modificacion:                                               |
//| cambios:                                                             |
//| Ruta: http://localhost:3000/api/categoria/obtener/:idCategoria       |
//|----------------------------------------------------------------------|

app.get('/obtener/:idCategoria', (req, res) => {
    let id = req.params.idCategoria;
    Categoria.find({ _id: id }).then((categoria) => {
        if (categoria.length <= 0) {
            return res.status(404).json({
                ok: false,
                status: 404,
                msg: 'Esta categoria no existe en la base de datos',
            });
        }
        return res.status(200).json({
            ok: true,
            status: 200,
            msg: 'Se ha consultado correctamente la categoria',
            count: categoria.length,
            cont: categoria
        });
    }).catch((err) => {
        return res.status(400).json({
            ok: false,
            status: 400,
            msg: 'Error al obtener la categoria',
            err: Object.keys(err).length === 0 ? err.message : err
        });
    })
});

//|-------------Api POST Registrar una categoria-------------------------|
//| Creada por: NNAV                                                     |
//| Fecha: 31/07/2020                                                    |
//| Api que registra una categoria                                       |
//| modificada por:                                                      |
//| Fecha de modificacion:                                               |
//| cambios:                                                             |
//| Ruta: http://localhost:3000/api/categoria/registrar                  |
//|----------------------------------------------------------------------|

app.post('/registrar', (req, res) => {

    let body = req.body;

    let strNombre = '';

    var regex = new RegExp(["^", body.strNombre, "$"].join(""), "i");

    Categoria.find({ 'strNombre': regex }).then((data) => {

        if (data.length > 0) {
            return res.status(400).json({
                ok: false,
                status: 400,
                msg: 'Esta categoria ya existe',
            });
        }

        strNombre = body.strNombre.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });


        let categoria = new Categoria({
            strNombre: strNombre,
            strDescripcion: body.strDescripcion,
            blnActivo: body.blnActivo
        });

        Categoria.findOne({ 'strNombre': strNombre }).then((encontrado) => {

            if (encontrado) {
                return res.status(400).json({
                    ok: false,
                    status: 400,
                    msg: 'Esta categoría ya existe'
                });
            }

            categoria.save().then((categoriaDB) => {
                return res.status(200).json({
                    ok: true,
                    resp: 200,
                    msg: 'Se ha registrado correctamente la categoría',
                    cont: categoriaDB
                });
            }).catch((err) => {
                return res.status(400).json({
                    ok: false,
                    resp: 400,
                    msg: 'Error al registrar la categoría',
                    err: Object.keys(err).length === 0 ? err.message : err
                });
            })
        });

    }).catch((err) => {
        console.log(err);
        return res.status(500).json({
            ok: false,
            status: 400,
            msg: 'Ha ocurrido un error con el servidor',
            err: Object.keys(err).length === 0 ? err.message : err
        });
    });
});

//|-------------Api PUT Modificar una categoria--------------------------|
//| Creada por: NNAV                                                     |
//| Fecha: 30/07/2020                                                    |
//| Api que modifica una categoria                                       |
//| modificada por:                                                      |
//| Fecha de modificacion:                                               |
//| cambios:                                                             |
//| Ruta: http://localhost:3000/api/categoria/modificar/:idCategoria     |
//|----------------------------------------------------------------------|

app.put('/modificar/:idCategoria', (req, res) => {
    let id = req.params.idCategoria;

    let body = _.pick(req.body, ['strNombre', 'strDescripcion', 'blnActivo']);

    var regex = new RegExp(["^", body.strNombre, "$"].join(""), "i");

    Categoria.find({ 'strNombre': regex, 'strDescripcion': body.strDescripcion, 'blnActivo': body.blnActivo }).then((data) => {

        if (data.length > 0) {
            return res.status(400).json({
                ok: false,
                status: 400,
                msg: 'Esta categoria ya existe',
            });
        }

        Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }).then((categoriaDB) => {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'La respuesta se ha actualizado exitosamente.',
                cont: categoriaDB
            });
        }).catch((err) => {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error al intentar actualizar la categoría',
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

//|-------------Api DELETE Desactivar una categoria----------------------|
//| Creada por: NNAV                                                     |
//| Fecha: 30/07/2020                                                    |
//| Api que desactiva una categoria                                      |
//| modificada por:                                                      |
//| Fecha de modificacion:                                               |
//| cambios:                                                             |
//| Ruta: http://localhost:3000/api/categoria/eliminar/:idCategoria      |
//|----------------------------------------------------------------------|

app.delete('/eliminar/:idCategoria', (req, res) => {
    let id = req.params.idCategoria;

    Categoria.findByIdAndUpdate(id, { blnActivo: false }, { new: true, runValidators: true, context: 'query' }).then((resp) => {
        return res.status(200).json({
            ok: true,
            status: 200,
            msg: 'Se ha desactivado correctamente la categoría',
            cont: resp
        });
    }).catch((err) => {
        return res.status(400).json({
            ok: false,
            status: 400,
            msg: 'Error al desactivar la categoria',
            err: Object.keys(err).length === 0 ? err.message : err
        });
    })
});
//|-------------Api PUT Activar una categoria ---------------------------|
//| Creada por: NNAV                                                     |
//| Fecha: 31/07/2020                                                    |
//| Api que desactiva una categoria                                      |
//| modificada por:                                                      |
//| Fecha de modificacion:                                               |
//| cambios:                                                             |
//| Ruta: http://localhost:3000/api/categoria/Activar/:idCategoria       |
//|----------------------------------------------------------------------|

app.delete('/activar/:idCategoria', (req, res) => {
    let id = req.params.idCategoria;

    Categoria.findByIdAndUpdate(id, { blnActivo: true }, { new: true, runValidators: true, context: 'query' }).then((resp) => {
        return res.status(200).json({
            ok: true,
            status: 200,
            msg: 'Se ha activado correctamente la categoría',
            cont: resp
        });
    }).catch((err) => {
        return res.status(400).json({
            ok: false,
            status: 400,
            msg: 'Error al activar la categoria',
            err: Object.keys(err).length === 0 ? err.message : err
        });
    })
});

module.exports = app;