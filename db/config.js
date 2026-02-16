// import mongoose from 'mongoose';
// import express from 'express';

// const app = express();

// app.get = ('/', (req, resp) => {
//     const connection = mongodb.connect();
//     resp.send("Conneted");
// })

// const connectDb = async () => {
//     mongoose.connect('mongodb://localhost:27017/e-com');
//     const productSchema = new mongoose.Schema({});
//     const product = mongoose.model('products', productSchema);
//     const data = await product.find();
//     console.log(data);
// }
// connectDb();
// app.listen(5600);

const dotenv = require("dotenv");
dotenv.config();
const mongoose = require('mongoose');
console.log("MONGO_URI =", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("Mongo error", err));