import { productModel } from "../../DB/Models/product.model.js";
import { categoryModel } from "../../DB/Models/category.model.js";
import { subcategoryModel } from "../../DB/Models/subcategory.model.js";
import { brandModel } from "../../DB/Models/brand.model.js";
import v2 from "../../services/media.config.js";
import slugify from "slugify";
//admin
const add = async (req, res, next) => {
    try {
        const { name, description, colors, price, sizes, stock, category_id, subcategory_id, brand_id } = req.body;
        const category = await categoryModel.findById(category_id);
        if(!category) return next(new Error("Invalid category",{cause:400}));
        const subcategory = await subcategoryModel.findOne({ _id: subcategory_id, category_id });
        if(!subcategory) return next(new Error("Invalid subcategory for this category", { cause: 400 }));
        const brand = await brandModel.findById(brand_id);
        if(!brand) return next(new Error("Invalid brand",{cause:400}));
        const isExist = await productModel.findOne({ name });
        if(isExist){
            return next(new Error("Product name already exists", { cause: 409 }));
        }
        if(price < 0){
            return next(new Error("Product price must be positive", { cause: 409 }));
        }
        if(stock < 0){
            return next(new Error("Product stock must be positive", { cause: 409 }));
        }
        const {secure_url,public_id} = await v2.uploader.upload(req.file.path,{
            folder:"e-comm/products"
        });
        const data = await productModel.create({
            name,
            slug:slugify(name),
            description,
            colors,
            price,
            sizes,
            stock,
            image:{secure_url,public_id},
            category_id,
            subcategory_id,
            brand_id,
            createdBy:req.user._id
        });
        return res.status(201).json({
            message: "product added successfully",
            data
        });
    } catch (error) {
        return next(error);
    }
};

const getAll = async (req, res, next) => {
    try {
        const products = await productModel.find();
        return res.status(200).json({ message: "Products fetched successfully", products });
    } catch (error) {
        return next(error);
    }
};
//admin
const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map((file) => `media/${file.filename}`);
        }
        const updated = await productModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!updated) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({ message: "Product updated successfully", product: updated });
    } catch (error) {
        return next(error);
    }
};
//admin
const remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await productModel.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        return next(error);
    }
};

export { add, getAll, update, remove }