const express=require('express');
const { Sales, customSales, ProfitLoss } = require('../controllers/salesPageController');
const { authMiddleware } = require('../middlewares/Authentication');
const router=express.Router();

router.get("/custom",authMiddleware,customSales)
router.get("/checkSales",authMiddleware,Sales)
router.get("/profit",authMiddleware,ProfitLoss)

module.exports=router;