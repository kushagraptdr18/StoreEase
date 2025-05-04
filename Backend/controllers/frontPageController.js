const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const shopkeeperModel = require("../models/shopkeeperModel");
const billingModel = require("../models/billingModel");

exports.signup = async (req, res) => {
  
    const { name, email, password, phone, location,shopname } = req.body;

    
    const existing = await shopkeeperModel.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });
    
    const user = new shopkeeperModel({ name, email, password, phone, location,shopname  });
    await user.save();

    res.status(201).json({ success: true, message: "Shopkeeper registered successfully" });
  } 


  exports.login = async (req, res) => {
    
      const { email, password } = req.body;
  
      const user = await shopkeeperModel.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid email or password" });
  
      const check = await bcrypt.compare(password, user.password);
      if (!check) return res.status(400).json({ message: "Invalid email or password" });
  
      const token = jwt.sign(
        { id: user._id, email: user.email }, 
        process.env.JWT_SECRET, 
        { expiresIn: "7d" }
      );
  
      
      res.cookie("token", token);
  
      res.status(200).json({ 
        success: true, 
        message: "Shopkeeper logged in successfully",
        token     
      });
    
  };

  exports.getProfile = async (req, res) => {
    try {
      const user = await shopkeeperModel.findById(req.user._id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.frontPage= async(req,res)=>{
    try {
    const shopkeeperId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const check = await shopkeeperModel.findById(req.user._id);

    const bills = await billingModel.find({
      shopkeeperId: shopkeeperId,
      createdAt: { $gte: today, $lt: tomorrow }
  }).populate("customerId", "name phone").select("customerId  amount paymentMode");


  let totalSales=0;
  let debt=0;
  let cash=0;
  
  bills.forEach(bill => {
    totalSales += bill.amount;
    if (bill.paymentMode === "debt") {
        debt += bill.amount;
    } else if (bill.paymentMode === "cash") {
        cash += bill.amount;
    }
});


  res.json({
    success: true,
    totalSales,
    debt,
    cash,
    bills,
    shopname:check.shopname
});}
catch (error) {
  res.status(500).json({ error: error.message });
}
};
  

  exports.logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0)
  });
  res.json({ success: true, message: "You have logged out" });
};