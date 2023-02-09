//Imported Variables
const mongoose = require('mongoose');


//Order Schema
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    quantity: { type: Number, default: 1 , required: true},
});

module.exports = mongoose.model('Order', orderSchema);