const express = require('express');
require('./db/config');
const User = require('./db/user')
const app = express();
app.use(express.json());
app.get('/', (req, resp) => {
    resp.send("App is working now");
});

app.post("/register", async(req, resp) => {
    const user = new User(req.body);
    const result = await user.save();
    resp.send(result);
});

app.listen(5600);