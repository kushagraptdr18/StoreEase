const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    shopkeeperId: { type: mongoose.Schema.Types.ObjectId, ref: "Shopkeeper" },
    name: { type: String},
    brand: { type: String },
    category: { type: String },
   cp: { type: Number }, 
    sp: { type: Number}, 
    stock: { type: Number, default: 0 }, 
    totalInvestment: { type: Number, default: 0 }, 
    discount: { type: Number, default: 0 }
    
}, { timestamps: true });

productSchema.methods.purchaseStock = async function (quantity, costPricePerUnit) {
    this.stock += quantity;
    this.totalInvestment += quantity * costPricePerUnit; 
    await this.save();

};

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
