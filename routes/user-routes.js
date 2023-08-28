const express = require('express');
const getUser = require('../controllers/user-controller');

const userRoutes = express.Router();

userRoutes.post("/signup", getUser.signup)

userRoutes.post("/login", getUser.login)

module.exports = userRoutes;