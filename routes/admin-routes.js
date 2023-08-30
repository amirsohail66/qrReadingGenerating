const express = require('express');
const getAdmin = require('../controllers/admin-controller');
const { isAuth } = require('../middleware/isAuth');

const adminRoutes = express.Router();

adminRoutes.get("/getUsers", isAuth,getAdmin.getAllUser)

adminRoutes.post("/signup", getAdmin.signup)

adminRoutes.post("/login", getAdmin.login)

adminRoutes.delete("/delete", isAuth,getAdmin.delete)

adminRoutes.post("/sendEmail", getAdmin.sendEmailToUser)

module.exports = adminRoutes; 