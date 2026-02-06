const express = require('express');
const app = express();
const cores = require('cors');
const Jwt = require('jsonwebtoken');
const tokenKey = 'e-comm';
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
    if (user) {
        Jwt.sign({ result }, tokenKey, { expiresIn: "2h" }, (err, token) => {
            if (err) {
                resp.send({ result: "Something went wrong..." });
            }
            resp.send({ result, auth: token });
        });
    }
});


app.post("/login", async (req, resp) => {
    if (req.body.name && req.body.password) {
        const user = await User.findOne(req.body).select("-password");
        if (user) {
            Jwt.sign({ user }, tokenKey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    resp.send({ result: "Something went wrong..." });
                }
                resp.send({ user, auth: token });
            });
        } else {
            resp.send({ result: "No User Found" });
        }
    } else {
        resp.send({ result: "No User Found" });
    }
});

app.post("/add-product", verifyToken, async (req, resp) => {
    let data = new Product(req.body);
    let result = await data.save();
    resp.send(result);
});

app.get("/product-list", verifyToken, async (req, resp) => {
    let products = await Product.find();
    if (products.length) {
        resp.send(products);
    } else {
        resp.send({ result: "No Products Found" });
    }
});

app.delete("/product/:id", verifyToken, async (req, resp) => {
    const result = await Product.deleteOne({ _id: req.params.id });
    resp.send(result);
});

app.get("/product/:id", verifyToken, async (req, resp) => {
    let result = await Product.findOne({ _id: req.params.id });
    if (result) {
        resp.send(result);
    } else {
        resp.send("Record not found!!");
    }
});

app.put("/product/update/:id", verifyToken, async (req, resp) => {
    let result = await Product.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    );
    resp.send(result);
});

app.get("/search/:key", verifyToken, async (req, resp) => {
    let result = await Product.find({
        "$or": [
            { name: { $regex: req.params.key } },
            { category: { $regex: req.params.key } },
            { brand: { $regex: req.params.key } },
            { price: { $regex: req.params.key } },
        ]
    });
    resp.send(result);
})

//middleware function
function verifyToken(req, resp, next) {
    let token = req.headers['authorization'];
    if (token) {
        token = token.split(' ')[1];
        console.log("middleware called", token);
        Jwt.verify(token, tokenKey, (err, valid) => {
            if (err) {
                resp.status(401).send({ result: "Please provide valid token" });
            } else {
                next();
            }
        });
    } else {
        resp.status(401).send({ result: "Please add token with headers" });
    }
}

const PORT = process.env.PORT || 5600;
app.listen(PORT, () => console.log("Server running"));