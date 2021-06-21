const mongoose = require('mongoose');


const transferSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }

});




module.exports = mongoose.model('transferModel', transferSchema)