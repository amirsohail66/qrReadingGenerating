const express = require('express');
const getUser = require('../controllers/user-controller');
const {isAuth} = require('../middleware/isAuth');
const qrController = require('../controllers/qrController');
const { validateUserSignupInput, validateLoginInput, handleValidationErrors } = require('../middleware/validatInput');
const userRoutes = express.Router();

userRoutes.post("/signup",validateUserSignupInput, handleValidationErrors, getUser.signup);
userRoutes.post("/login", validateLoginInput, handleValidationErrors, getUser.login);
userRoutes.get("/myqrcodes/:userId", isAuth, qrController.getUserQRCodes);
userRoutes.put("/updateUser/:userId", isAuth,getUser.updateUser)
userRoutes.delete('/deleteqrcode/:qrcodeId', isAuth, getUser.deleteUserQRCode); 
userRoutes.get('/myqrcodes', isAuth, qrController.getUserQRCodes);

module.exports = userRoutes;