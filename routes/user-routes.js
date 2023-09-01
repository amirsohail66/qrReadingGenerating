const express = require('express');
const getUser = require('../controllers/user-controller');
const {isAuth} = require('../middleware/isAuth');
const qrController = require('../controllers/qrController');
const { validateUserSignupInput, validateLoginInput, handleValidationErrors } = require('../middleware/validatInput');
const userRoutes = express.Router();

userRoutes.post("/signup",validateUserSignupInput, handleValidationErrors, getUser.signup);
userRoutes.post("/login", validateLoginInput, handleValidationErrors, getUser.login);
userRoutes.get("/myqrcodes", isAuth, qrController.getUserQRCodes);
userRoutes.post("/logout", getUser.logout)
userRoutes.put("/updateUser", isAuth,getUser.updateUser)

module.exports = userRoutes;