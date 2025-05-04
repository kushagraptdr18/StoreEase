const express=require('express');
const { payDebt, getAllCustomers } = require('../controllers/customerPageController');
const { authMiddleware } = require('../middlewares/Authentication');
const router=express();

router.post('/payDebt',payDebt)
router.get('/getAll',authMiddleware,getAllCustomers)

module.exports=router