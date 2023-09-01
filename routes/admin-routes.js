const express = require('express');
const getAdmin = require('../controllers/admin-controller');
const { isAuth } = require('../middleware/isAuth');
const { validateAdminSignupInput, handleValidationErrors, validateLoginInput } = require('../middleware/validatInput');
const adminRoutes = express.Router();

adminRoutes.get("/getUsers", isAuth,getAdmin.getAllUser)
adminRoutes.post("/signup",validateAdminSignupInput, handleValidationErrors,getAdmin.signup)    
adminRoutes.post("/login", validateLoginInput, handleValidationErrors,getAdmin.login)
adminRoutes.delete("/delete", isAuth,getAdmin.delete)
adminRoutes.post("/sendEmail", isAuth, getAdmin.sendEmailToUser)
adminRoutes.post("/logout", getAdmin.logout)

module.exports = adminRoutes;