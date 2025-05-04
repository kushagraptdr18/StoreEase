const express= require('express');

const { authMiddleware } = require('../middlewares/Authentication');
const { createBill } = require('../controllers/billingPageController');
const route=express.Router();


route.post("/createBill", authMiddleware,createBill);




module.exports=route;