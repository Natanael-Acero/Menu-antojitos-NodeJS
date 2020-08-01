const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let platilloSchema = new Schema({

    idCategoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: [true, 'Favor de ingresar el id de la categoria']
    },
    strNombre: {
        type: String,
        required: [true, 'Favor de ingresar el nombre']
    },
    strDescripcion: {
        type: String,
        required: [true, 'Favor de ingresar una descripcion']
    },
    strIngredientes: {
        type: String,
        required: [true, 'Favor de ingresar los ingredientes']
    },
    nmbPiezas: {
        type: Number,
        required: [true, 'Favor de ingresar el numero de piezas']
    },
    nmbPrecio: {
        type: Number,
        required: [true, 'Favor de ingresar el precio']
    },
    blnActivo: {
        type: Boolean,
        required: [true, 'Favor de ingresar el estado del platillo']
    }
});

platilloSchema.plugin(uniqueValidator, {
    message: '{PATH} Debe ser único y diferente'
});

module.exports = mongoose.model('Platillo', platilloSchema);

