const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
    shopkeeperId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Shopkeeper"},
    customerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Customer"},
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product"},
        quantity: { type: Number },
        sp: { type: Number},
        cp: { type: Number},
        discount: { type: Number , default:0}
    }],
    amount: { type: Number },
    discount: { type: Number },
    paymentMode:{type: String}
}, { timestamps: true });

module.exports =mongoose.models.Bill  || mongoose.model("Bill", billSchema);
