//Imported variables
const mongoose = require('mongoose');

//Product Schema
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String},
    price:{ type: Number, required: true},
    year:{ type: Number, required: true},
    model:{ type: String}
});

module.exports = mongoose.model('Product', productSchema);