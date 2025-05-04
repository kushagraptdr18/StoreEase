const productModel=require('../models/productModel')
const shopkeeperModel = require("../models/shopkeeperModel");


exports.addProduct = async (req, res) => {
  
        const { name, brand, cp, sp, stock, category,discount} = req.body;
        const shopkeeperId = req.user.id;

        const product = new productModel({
            name,
            brand,
            cp,
            sp,
            stock,
            totalInvestment: cp * stock,
            category,discount,
            shopkeeperId

        });

        await product.save();

        await shopkeeperModel.findByIdAndUpdate(shopkeeperId, {
            $push: { products: product._id }
        });


        res.status(201).json({ success: true, message: "Product added successfully", product });
    } ;




    exports.updateProduct = async (req, res) => {
        try {
            const { name, brand, cp, sp, stock,discount } = req.body;
            const product = await productModel.findById(req.params.id);
    
            if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    
            let updatedFields = { name, brand, cp, sp, stock,discount  };
            
            let newStock = product.stock;
            let newCP = product.cp;

             if (stock !== undefined) {
                newStock = stock;
             }

        if (cp !== undefined) {
            newCP = cp;
        }

        
        updatedFields.totalInvestment = newStock * newCP;
            
    
            const updated= await productModel.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
    
            res.json({ success: true, message: "Product updated successfully", product: updated });
    
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    };





    exports.deleteProduct = async (req, res) => {
       try
           { const product = await productModel.findByIdAndDelete(req.params.id);
            if (!product) return res.status(404).json({ success: false, message: "Product not found" });

            await shopkeeperModel.findByIdAndUpdate(req.user._id, {
                $pull: { products: product._id }
            });


            res.json({ success: true, message: "Product deleted successfully" });}
            catch(e){
                res.status(500).json({ success: false, error: error.message });
            }
        };
    

        exports.getSingleProduct = async (req, res) => {
            
                const product = await productModel.findById(req.params.id);
                if (!product) return res.status(404).json({ success: false, message: "Product not found" });
        
                res.json({ success: true, product });
            };



            exports.getAllProducts = async (req, res) => {
                
                const shopkeeperId = req.user.id; 
                let { search } = req.query;
        
                let products = await productModel.find({ shopkeeperId });
        
                if (search) {
                    products = products.filter(product =>
                        product.name.toLowerCase().includes(search.toLowerCase())
                    );
                }
                 
                
                res.json({ success: true, products });
            };
            