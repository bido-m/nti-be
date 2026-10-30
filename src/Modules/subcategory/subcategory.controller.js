import { subcategoryModel } from "../../DB/Models/subcategory.model.js";
import { categoryModel } from "../../DB/Models/category.model.js";
import slugify from "slugify";

const getAll = async (req,res,next) => {
    try {
        const subcategories = await subcategoryModel.find();
        return res.status(200).json({message:"subcategories fetched successfully",subcategories})
    } catch (error) {
        return next(error);
    }
};

const get = async (req,res,next) => {
    try {
        const {_id} = req.params;
        const subcategory = await subcategoryModel.findById(_id).populate("category_id","name -_id");
        return res.status(200).json({message:"subcategory fetched successfully",subcategory});
    } catch (error) {
        return next(error);
    }
};
//admin
const add = async (req,res,next) => {
    try {
        const {name,category_id} = req.body;
        if(!name){
            return next(new Error("Subcategory name is required", {cause: 400 }));
        }
        if(!category_id){
            return next(new Error("Category id is required", {cause: 400 }));
        }
        const category = await categoryModel.findById(category_id);
        if (!category) return next(new Error("Category not found", { cause: 404 }));
        const exist = await subcategoryModel.findOne({ name, category_id });
        if (exist) return next(new Error("Subcategory already exists in this category", { cause: 409 }));
        const data = await subcategoryModel.create({
            name,
            slug:slugify(name),
            category_id,
            createdBy:req.user._id
        });
        return res.status(201).json({message:"subcategory created successfully",data});
    } catch (error) {
        return next(error);
    }
};
//admin
const update = async (req,res,next) => {
    try {
        const {_id} = req.params;
        const {name,slug,category_id} = req.body;
        const subcategory = await subcategoryModel.findByIdAndUpdate({_id},{name,slug,category_id},{new:true});
        return res.status(200).json({message:"subcategory updated successfully",subcategory});
    } catch (error) {
        return next(error);
    }
};
//admin
const remove = async (req,res,next) => {
    try {
        const {_id} = req.params;
        await subcategoryModel.findByIdAndDelete(_id);
        return res.status(200).json({message:"subcategory deleted successfully"});
    } catch (error) {
        return next(error);
    }
};

export{ getAll, get, add, update, remove };