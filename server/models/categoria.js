const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({

    strNombre: {
        type: String,
        required: [true, 'Favor de ingresar el nombre de la categoria']
    },
    strDescripcion: {
        type: String,
        required: [true, 'Favor de ingresar una descripcion de la categoria']
    },
    blnActivo: {
        type: Boolean,
        required: [true, 'Favor de ingresar el estado de la categoria']
    }
});

categoriaSchema.plugin(uniqueValidator, {
    message: '{PATH} Debe ser único y diferente'
});

module.exports = mongoose.model('Categoria', categoriaSchema);

