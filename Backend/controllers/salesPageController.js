const billingModel = require("../models/billingModel");
const moment=require('moment');
const mongoose = require("mongoose");

exports.customSales=async(req,res)=>{
    try {
        const { date } = req.query;  // Get date from query (format: YYYY-MM-DD)
        
        const shopkeeperId = req.user.id;

        if (!date) {
            return res.status(400).json({ error: "Date is required in YYYY-MM-DD format" });
        }

        const starting = moment(date, "YYYY-MM-DD").startOf("day").toDate();
        const ending = moment(date, "YYYY-MM-DD").endOf("day").toDate();

        let sales = await billingModel.aggregate([
            {
                $match: {
                    shopkeeperId: new mongoose.Types.ObjectId(shopkeeperId),
                    createdAt: { $gte: starting, $lte: ending } 
                }
            },
            {
                $group: {
                    _id: null, 
                    totalSales: { $sum: "$amount" }
                }
            }
        ]);

        res.json({ date, totalSales: sales.length > 0 ? sales[0].totalSales : 0 });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.Sales=async(req,res)=>{
    let { type ,month} = req.query; 
    const shopkeeperId = req.user.id;
    const today = new Date();
    let starting, groupFormat, daysToFetch, formatLabel,ending;

    if (month) {  // If a specific month is provided (Format: YYYY-MM)
      if (!moment(month, "YYYY-MM", true).isValid()) {
          return res.status(400).json({ error: "Invalid month format. Use YYYY-MM." });
      }

      starting = moment(month, "YYYY-MM").startOf("month").toDate();  
      ending = moment(month, "YYYY-MM").endOf("month").toDate();      
      groupFormat = "%Y-%m-%d";  
      daysToFetch = moment(month, "YYYY-MM").daysInMonth();  
      formatLabel = (date) => moment(date).format("YYYY-MM-DD");
  } 

  

   else if (type === "daily") {
        starting = moment().subtract(30, "days").toDate();
        groupFormat = "%Y-%m-%d";
        daysToFetch = 30;
        formatLabel = (date) => moment(date).format("YYYY-MM-DD");
    } 
    
    
    
    
    else if (type === "weekly") {
        starting = moment().subtract(7, "days").toDate();
        groupFormat = "%Y-%m-%d";
        daysToFetch = 7;
        formatLabel = (date) => moment(date).format("YYYY-MM-DD");
    } 
    
    
    
    else if (type === "monthly") {
        const currentYear = moment().year();  
        starting = moment(`${currentYear}-01-01`).toDate();  
        groupFormat = "%Y-%m";  
        daysToFetch = 12;  
        formatLabel = (date) => moment(date, "YYYY-MM").format("MMM");
    } 
    
    
    
    else if (type === "yearly") {
        starting = moment().subtract(4, "years").toDate();
        groupFormat = "%Y";
        daysToFetch = 5;
        formatLabel = (date) => date;
    } 
    
    
    else {
        return res.status(400).json({ error: "Invalid type. Use daily, weekly, monthly, or yearly." });
    }

    try {


        let sales = await billingModel.aggregate([
            { $match: { shopkeeperId: new mongoose.Types.ObjectId(shopkeeperId), createdAt: { $gte: starting, $lte: today } } },
            { $group: { _id: { $dateToString: { format: groupFormat, date: "$createdAt" } }, totalSales: { $sum: "$amount" } } },
            { $sort: { _id: 1 } }//ascending order so id:1
        ]);

        let salesMap = new Map(sales.map(s => [s._id, s.totalSales]));

        let data = [];

        if (month) {  
          for (let i = 1; i <= daysToFetch; i++) {
              let date = moment(month, "YYYY-MM").date(i).format("YYYY-MM-DD");
              data.push({ _id: formatLabel(date), totalSales: salesMap.get(date) || 0 });
          }
      } 


       else if (type === "monthly") {
            const currentYear = moment().year();
            for (let i = 0; i < 12; i++) {  // Loop from Jan to Dec
                let date = moment(`${currentYear}-${i + 1}`, "YYYY-M").format("YYYY-MM");  // Format as "YYYY-MM"
                data.push({ _id: formatLabel(date), totalSales: salesMap.get(date) || 0 });
            }
        }
        else {for (let i = daysToFetch - 1; i >= 0; i--) {
            let date;
            if (type === "daily" || type === "weekly") {
                date = moment().subtract(i, "days").format("YYYY-MM-DD");
            }  else if (type === "yearly") {
                date = moment().subtract(i, "years").format("YYYY");
            }
            data.push({ _id: formatLabel(date), totalSales: salesMap.get(date) || 0 });
        }}

        res.json(data);
    } catch (err) {
        console.error("Error fetching sales data:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// exports.ProfitLoss = async (req, res) => {
//   try {
//       const { type } = req.query;
//       const shopkeeperId = req.user.id;
//       const today = new Date();
//       let starting, groupFormat, daysToFetch, formatLabel;

//       if (type === "daily") {
//           starting = moment().subtract(30, "days").toDate();
//           groupFormat = "%Y-%m-%d";
//           daysToFetch = 30;
//           formatLabel = (date) => moment(date).format("YYYY-MM-DD");
//       } 
//       else if (type === "weekly") {
//           starting = moment().subtract(7, "weeks").toDate();
//           groupFormat = "%Y-%U"; // Week format
//           daysToFetch = 7;
//           formatLabel = (date) => `Week ${moment(date, "YYYY-W").format("W")}`;
//       } 
//       else if (type === "monthly") {
//           const currentYear = moment().year();
//           starting = moment(`${currentYear}-01-01`).toDate();
//           groupFormat = "%Y-%m";
//           daysToFetch = 12;
//           formatLabel = (date) => moment(date, "YYYY-MM").format("MMM");
//       } 
//       else if (type === "yearly") {
//           starting = moment().subtract(4, "years").toDate();
//           groupFormat = "%Y";
//           daysToFetch = 5;
//           formatLabel = (date) => date;
//       } 
//       else {
//           return res.status(400).json({ error: "Invalid type. Use daily, weekly, monthly, or yearly." });
//       }

//       // Fetch bills within the date range
//       let bills = await billingModel.find({
//           shopkeeperId,
//           createdAt: { $gte: starting, $lte: today },
//       }).populate("items.productId"); 

//       let profitLossMap = new Map();
      
//       for (const bill of bills) {
//           let billProfit = 0;
//           let billDate = moment(bill.createdAt).format(groupFormat);

//           for (const item of bill.items) {
//               const product = item.productId;
//               if (!product) continue;

//               const cp = item.cp; 
//               const sp = item.sp; 
//               const quantity = item.quantity;
//               const discountAmount = (item.discount / 100) * sp;

//               const profitOrLoss = (sp - cp - discountAmount) * quantity;
//               billProfit += profitOrLoss;
//           }

//           if (!profitLossMap.has(billDate)) {
//               profitLossMap.set(billDate, { totalProfit: 0, totalLoss: 0 });
//           }

//           if (billProfit >= 0) {
//               profitLossMap.get(billDate).totalProfit += billProfit;
//           } else {
//               profitLossMap.get(billDate).totalLoss += Math.abs(billProfit);
//           }
//       }

//       // Generate final response data
//       let data = [];
//       if (type === "monthly") {
//           const currentYear = moment().year();
//           for (let i = 0; i < 12; i++) {  
//               let date = moment(`${currentYear}-${i + 1}`, "YYYY-M").format("YYYY-MM");  
//               data.push({ 
//                   _id: formatLabel(date), 
//                   totalProfit: profitLossMap.get(date)?.totalProfit || 0, 
//                   totalLoss: profitLossMap.get(date)?.totalLoss || 0 
//               });
//           }
//       }
//       else {
//           for (let i = daysToFetch - 1; i >= 0; i--) {
//               let date;
//               if (type === "daily" || type === "weekly") {
//                   date = moment().subtract(i, "days").format("YYYY-MM-DD");
//               } else if (type === "yearly") {
//                   date = moment().subtract(i, "years").format("YYYY");
//               }
//               data.push({
//                   _id: formatLabel(date),
//                   totalProfit: profitLossMap.get(date)?.totalProfit || 0,
//                   totalLoss: profitLossMap.get(date)?.totalLoss || 0,
//               });
//           }
//       }

//       res.json(data);
//   } catch (error) {
//       console.error("Error fetching profit/loss data:", error);
//       res.status(500).json({ error: "Internal Server Error" });
//   }
// };



exports.ProfitLoss = async (req, res) => {
  try {
      const { type } = req.query;
      const shopkeeperId = req.user.id;
      const today = new Date();
      let starting, groupFormat, daysToFetch, formatLabel;

      if (type === "daily") {
          starting = moment().subtract(30, "days").toDate();
          groupFormat = "%Y-%m-%d";
          daysToFetch = 30;
          formatLabel = (date) => moment(date).format("YYYY-MM-DD");
      } 
      else if (type === "weekly") {
          starting = moment().subtract(7, "days").toDate();
          groupFormat = "%Y-%m-%d";
          daysToFetch = 7;
          formatLabel = (date) => moment(date).format("YYYY-MM-DD");
      } 
      else if (type === "monthly") {
          const currentYear = moment().year();
          starting = moment(`${currentYear}-01-01`).toDate();
          groupFormat = "%Y-%m";
          daysToFetch = 12;
          formatLabel = (date) => moment(date, "YYYY-MM").format("MMM");
      } 
      else if (type === "yearly") {
          starting = moment().subtract(4, "years").toDate();
          groupFormat = "%Y";
          daysToFetch = 5;
          formatLabel = (date) => date;
      } 
      else {
          return res.status(400).json({ error: "Invalid type. Use daily, weekly, monthly, or yearly." });
      }

      // MongoDB Aggregation to Calculate Profit/Loss
      let profitLossData = await billingModel.aggregate([
          { 
              $match: { 
                  shopkeeperId: new mongoose.Types.ObjectId(shopkeeperId), 
                  createdAt: { $gte: starting, $lte: today } 
              } 
          },
          { $unwind: "$items" }, // Flatten the items array
          {
              $lookup: {
                  from: "products",
                  localField: "items.productId",
                  foreignField: "_id",
                  as: "productDetails"
              }
          },
          { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } }, // Ensure product exists
          {
              $group: {
                  _id: { $dateToString: { format: groupFormat, date: "$createdAt" } },
                  totalProfit: {
                      $sum: {
                          $multiply: [
                              { $subtract: [
                                  "$items.sp", 
                                  { $add: [
                                      "$items.cp", 
                                      { $multiply: ["$items.discount", 0.01, "$items.sp"] } 
                                  ]}
                              ]},
                              "$items.quantity"
                          ]
                      }
                  }
              }
          },
          { $sort: { _id: 1 } } // Sort by date ascending
      ]);

      // Convert Aggregation Result to Map for Easy Lookup
      let profitLossMap = new Map(profitLossData.map(entry => [entry._id, entry.totalProfit]));

      // Generate Final Data Array
      let data = [];
      
      if (type === "monthly") {
          const currentYear = moment().year();
          for (let i = 0; i < 12; i++) {  
              let date = moment(`${currentYear}-${i + 1}`, "YYYY-M").format("YYYY-MM");
              data.push({ 
                  _id: formatLabel(date), 
                  totalProfit: profitLossMap.get(date) || 0 
              });
          }
      } else {
          for (let i = daysToFetch - 1; i >= 0; i--) {
              let date;
              if (type === "daily" || type === "weekly") {
                  date = moment().subtract(i, "days").format("YYYY-MM-DD");
              } else if (type === "yearly") {
                  date = moment().subtract(i, "years").format("YYYY");
              }
              data.push({
                  _id: formatLabel(date),
                  totalProfit: profitLossMap.get(date) || 0
              });
          }
      }

      res.json(data);
  } catch (error) {
      console.error("Error fetching profit/loss data:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};