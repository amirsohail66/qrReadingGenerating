const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user-routes');
const adminRoutes = require('./routes/admin-routes');
const qrcodeRoute = require('./routes/qrcode'); // Import the qrcode route
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

app.use("/admin", adminRoutes)
app.use("/user",userRoutes)
app.use('/user/qrcode', qrcodeRoute);

mongoose
.connect(process.env.MONGO_URL)
.then(() => app.listen(3000))
.then(() => console.log("Connected to the Database and listening on the port 3000"))
.catch((err) => {
  console.log(err);
})
