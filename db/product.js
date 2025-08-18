const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:String,
    price:String,
    category:String,
    brand:String,
    userId:String
});
module.exports = new mongoose.model('products',productSchema);