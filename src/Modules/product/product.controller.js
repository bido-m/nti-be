import { productModel } from "../../DB/Models/product.model.js";
import { categoryModel } from "../../DB/Models/category.model.js";
import { subcategoryModel } from "../../DB/Models/subcategory.model.js";
import { brandModel } from "../../DB/Models/brand.model.js";
import v2 from "../../services/media.config.js";
import slugify from "slugify";
//admin
const add = async (req, res, next) => {
    try {
        const { name, description, colors, price, sizes, stock, category_id, subcategory_id, brand_id, image_url } = req.body;
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
        if(Number(price) < 0){
            return next(new Error("Product price must be positive", { cause: 409 }));
        }
        if(Number(stock) < 0){
            return next(new Error("Product stock must be positive", { cause: 409 }));
        }

        let imageData = {
            secure_url: image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
            public_id: "default_product"
        };

        if (req.file) {
            const {secure_url,public_id} = await v2.uploader.upload(req.file.path,{
                folder:"e-comm/products"
            });
            imageData = { secure_url, public_id };
        }

        const parsedColors = Array.isArray(colors) ? colors : (typeof colors === 'string' && colors.trim() ? colors.split(',').map(s => s.trim()) : []);
        const parsedSizes = Array.isArray(sizes) ? sizes : (typeof sizes === 'string' && sizes.trim() ? sizes.split(',').map(s => s.trim()) : []);

        const data = await productModel.create({
            name,
            slug: slugify(name, { lower: true }),
            description,
            colors: parsedColors,
            price: Number(price),
            sizes: parsedSizes,
            stock: Number(stock || 1),
            image: imageData,
            category_id,
            subcategory_id,
            brand_id,
            createdBy: req.user._id
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
        const { category_id, subcategory_id, brand_id, search } = req.query;
        let filter = {};
        if (category_id) filter.category_id = category_id;
        if (subcategory_id) filter.subcategory_id = subcategory_id;
        if (brand_id) filter.brand_id = brand_id;
        if (search && search.trim()) {
            const regex = new RegExp(search.trim(), "i");
            filter.$or = [{ name: regex }, { description: regex }];
        }

        const products = await productModel.find(filter)
            .populate("category_id", "name slug image")
            .populate("subcategory_id", "name")
            .populate("brand_id", "name logo")
            .populate("createdBy", "name email");

        return res.status(200).json({ message: "Products fetched successfully", products });
    } catch (error) {
        return next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id)
            .populate("category_id", "name")
            .populate("subcategory_id", "name")
            .populate("brand_id", "name logo")
            .populate("createdBy", "name email");

        if (!product) {
            return next(new Error("Product not found", { cause: 404 }));
        }

        return res.status(200).json({ message: "Product fetched successfully", product });
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

export { add, getAll, getById, update, remove };