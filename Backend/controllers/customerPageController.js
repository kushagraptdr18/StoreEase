const billingModel = require("../models/billingModel");
const customerModel = require("../models/customerModel");



exports.payDebt = async (req, res) => {
    try {
        const { phone, amountPaid } = req.body;
        let customer = await customerModel.findOne({ phone });
        customer.debt -= amountPaid;
        await customer.save();

        res.status(200).json({ success: true, message: "Debt paid successfully", remainingDebt: customer.debt });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllCustomers = async (req, res) => {
    try {
        const shopkeeperId = req.user._id;

        const customerIds = await billingModel.find({ shopkeeperId }).distinct("customerId");

       const f = await customerModel.find({ _id: { $in: customerIds } });


       
        res.status(200).json({ success: true, f });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};