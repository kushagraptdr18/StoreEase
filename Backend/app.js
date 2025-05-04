const express= require('express')
const dotenv = require("dotenv");
const cookieParser=require("cookie-parser")

dotenv.config();
const connectDB = require('./config/mongoConfig');

const authRoutes= require('./routes/frontPage');
const productRoutes = require('./routes/productPage');
const billRoutes = require('./routes/billingPage');
const customerRoutes= require('./routes/customerPage');
const summaryRoutes = require('./routes/summaryPage');



const morgan = require('morgan');



connectDB();

const app = express();

const cors = require('cors');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(cookieParser()); 

console.log(process.env.FRONTEND_URL);


app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    httpOnly: true,
    secure: true,
  }));


app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/bill",billRoutes)
app.use("/api/customer",customerRoutes)
app.use("/api/summary",summaryRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));