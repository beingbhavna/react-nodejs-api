const express = require('express');
const app = express();
const cores = require('cors');
require('./db/config');
const User = require('./db/user');
app.use(express.json());
const Product = require('./db/product')
app.use(cores());  //middleware
app.get('/', (req, resp) => {
    resp.send("App is working now");
});

app.post("/register", async (req, resp) => {
    const user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    resp.send(result);
});


app.post("/login", async (req, resp) => {
    if (req.body.name && req.body.password) {
        const user = await User.findOne(req.body).select("-password");
        if (user) {
            resp.send(user);
        } else {
            resp.send({ result: "No User Found" });
        }
    } else {
        resp.send({ result: "No User Found" });
    }
});

app.post("/add-product", async (req, resp) => {
    let data = new Product(req.body);
    let result = await data.save();
    resp.send(result);
});

app.get("/product-list", async (req, resp) => {
    let products = await Product.find();
    if (products.length) {
        resp.send(products);
    } else {
        resp.send({ result: "No Products Found" });
    }
});

app.delete("/product/:id", async (req, resp) => {
    const result = await Product.deleteOne({_id:req.params.id});
    resp.send(result);
});

app.listen(5600);