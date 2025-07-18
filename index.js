const express = require('express');
const cores = require('cors');
require('./db/config');
const User = require('./db/user');
const app = express();
app.use(express.json());
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

app.listen(5600);