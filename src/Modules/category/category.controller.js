import { categoryModel } from "../../DB/Models/category.model.js";
import v2 from "../../services/media.config.js";
import slugify from "slugify";

const getAll = async (req,res,next) => {
    try {
        const data = await categoryModel.find().populate("createdBy", "name email");
        return res.status(200).json({
            message:"categories fetched successfully",
            count:data.length,
            data
        })
    } catch (error) {
        return next(error);
    }
};

const get = async (req,res,next) => {
    try {
        const {_id} = req.params;
        const data = await categoryModel.findById(_id);
        if(!data){
            return next(new Error("Category not found", { cause: 404 }));
        }
        return res.status(200).json({message:"category fetched successfully",data});
    } catch (error) {
        return next(error);
    }
};
//admin
const add = async (req,res,next) => {
    try {
        const {name} = req.body;
        if(!name){
            return next(new Error("Category name is required", {cause: 400 }));
        }
        if(!req.file){
            return next(new Error("Category image is required", { cause: 400 }));
        }
        const isExist = await categoryModel.findOne({ name });
        if(isExist){
            return next(new Error("Category name already exists", { cause: 409 }));
        }
        const {secure_url,public_id} = await v2.uploader.upload(req.file.path,{
            folder:"e-comm/categories"
        });
        const data = await categoryModel.create({
            name,
            slug:slugify(name),
            image:{secure_url,public_id},
            createdBy:req.user._id
        });
        return res.status(201).json({message:"category created successfully",data});
    } catch (error) {
        return next(error);
    }
};
//admin
const update = async (req,res,next) => {
    try {
        const {_id} = req.params;
        const {name} = req.body;
        const category = await categoryModel.findById(_id);
        if (!category) {
            return next(new Error("Category not found", { cause: 404 }));
        }
        if (name) {
            if (name === category.name) {
                return next(new Error("New name cannot match the old name", { cause: 400 }));
            }
            const isExist = await categoryModel.findOne({ name });
            if (isExist) {
                return next(new Error("Category name already exists", { cause: 409 }));
            }
            category.name = name;
            category.slug = slugify(name, { lower: true });
        }
        if (req.file) {
            await v2.uploader.destroy(category.image.public_id);

            const { secure_url, public_id } = await v2.uploader.upload(req.file.path, {
                folder: "ecommerce/categories"
            });
            category.image = { secure_url, public_id };
        }
        await category.save();
        return res.status(200).json({message:"category updated successfully",category});
    } catch (error) {
        return next(error);
    }
};
//admin
const remove = async (req,res,next) => {
    try {
        const {_id} = req.params;
        const category = await categoryModel.findByIdAndDelete(_id);
        if (!category) {
            return next(new Error("Category not found", { cause: 404 }));
        }
        await v2.uploader.destroy(category.image.public_id);
        return res.status(200).json({message:"category deleted successfully"});
    } catch (error) {
        return next(error);
    }
};

export{ getAll, get, add, update, remove };