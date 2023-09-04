const express = require('express');
const getAdmin = require('../controllers/admin-controller');
const { isAuth } = require('../middleware/isAuth');
const { handleValidationErrors, validateLoginInput } = require('../middleware/validatInput');
const adminRoutes = express.Router();

adminRoutes.get("/getUsers", isAuth,getAdmin.adminGetAllUser)  
adminRoutes.post("/login", validateLoginInput, handleValidationErrors,getAdmin.adminLogin)
adminRoutes.delete("/delete", isAuth,getAdmin.adminDelete)
adminRoutes.post("/sendEmail", isAuth, getAdmin.adminSendEmailToUser)

module.exports = adminRoutes;