const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const shopkeeperModel = require("../models/shopkeeperModel");
require('dotenv').config();
const secretKey = process.env.JWT_SECRET;

exports.authMiddleware = async (req, res, next) => {
    
        const token = req.cookies.token;
        console.log(token)
        if (!token) {
            return res.status(401).json({ error: "Not logged in" });
        }

        jwt.verify(token, secretKey, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: "Invalid token" });
            }

            const { id ,email} = decoded;
            const user = await shopkeeperModel.findById(id);

            if (!user) {
                return res.status(401).json({ error: "Please log in" });
            }
             
            req.user = user;
            next();
        });
    
};
