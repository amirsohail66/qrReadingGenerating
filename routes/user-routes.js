const express = require('express');
const getUser = require('../controllers/user-controller');
const {isAuth} = require('../middleware/isAuth');
const qrController = require('../controllers/qrController');
const { validateSignupInput } = require('../middleware/validatInput');

const userRoutes = express.Router();

userRoutes.post("/signup",validateSignupInput, getUser.signup);
userRoutes.post("/login", getUser.login);
userRoutes.get("/myqrcodes", isAuth, qrController.getUserQRCodes);
userRoutes.post("/logout", getUser.logout)

module.exports = userRoutes;