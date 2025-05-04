const express= require('express');
const { signup, login, getProfile, logout, frontPage } = require('../controllers/frontPageController');
const { authMiddleware } = require('../middlewares/Authentication');
const route=express.Router();


route.post("/signup", signup);
route.post("/login", login);
route.get("/profile", authMiddleware, getProfile);
route.get("/logout", logout);
route.get("/showData",authMiddleware,frontPage)



module.exports=route;