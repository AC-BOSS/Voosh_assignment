const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
    user_id:{
        type: String,
        required: true
    },
    sub_total:{
        type: Number,
        default: 0
    },
    phone: String
});

module.exports = mongoose.model("Order", OrderSchema);