const express = require('express');
const getAdmin = require('../controllers/admin-controller');

const adminRoutes = express.Router();

adminRoutes.get("/getUsers", getAdmin.getAllUser)

adminRoutes.post("/signup", getAdmin.signup)

adminRoutes.post("/login", getAdmin.login)

adminRoutes.delete("/delete", getAdmin.delete)

module.exports = adminRoutes;