import { brandModel } from "../../DB/Models/brand.model.js";
import v2 from "../../services/media.config.js";
import slugify from "slugify";

// admin
const add = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name) {
            return next(new Error("Brand name is required", { cause: 400 }));
        }
        if (!req.file) {
            return next(new Error("Brand logo is required", { cause: 400 }));
        }

        const isExist = await brandModel.findOne({ name });
        if (isExist) {
            return next(new Error("Brand name already exists", { cause: 409 }));
        }

        const { secure_url, public_id } = await v2.uploader.upload(req.file.path, {
            folder: "e-comm/brands"
        });

        const data = await brandModel.create({
            name,
            slug: slugify(name, { lower: true }),
            logo: { secure_url, public_id },
            createdBy: req.user._id
        });

        return res.status(201).json({ message: "Brand created successfully", data });
    } catch (error) {
        return next(error);
    }
};


const getAll = async (req, res, next) => {
    try {
        const brands = await brandModel.find().populate("createdBy", "name email");
        return res.status(200).json({ message: "Success", count: brands.length, data: brands });
    } catch (error) {
        return next(error);
    }
};


const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const brand = await brandModel.findById(id).populate("createdBy", "name email");

        if (!brand) {
            return next(new Error("Brand not found", { cause: 404 }));
        }

        return res.status(200).json({ message: "Success", data: brand });
    } catch (error) {
        return next(error);
    }
};

// admin
const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const brand = await brandModel.findById(id);

        if (!brand) {
            return next(new Error("Brand not found", { cause: 404 }));
        }

        if (req.body.name) {
            if (req.body.name === brand.name) {
                return next(new Error("New name cannot be the same as the old name", { cause: 400 }));
            }

            const isExist = await brandModel.findOne({ name: req.body.name });
            if (isExist) {
                return next(new Error("Brand name already exists", { cause: 409 }));
            }

            brand.name = req.body.name;
            brand.slug = slugify(req.body.name, { lower: true });
        }

        if (req.file) {
            await v2.uploader.destroy(brand.logo.public_id);
            const { secure_url, public_id } = await v2.uploader.upload(req.file.path, {
                folder: "e-comm/brands"
            });
            brand.logo = { secure_url, public_id };
        }

        await brand.save();

        return res.status(200).json({ message: "Brand updated successfully", data: brand });
    } catch (error) {
        return next(error);
    }
};

// admin
const remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const brand = await brandModel.findByIdAndDelete(id);

        if (!brand) {
            return next(new Error("Brand not found", { cause: 404 }));
        }

        await v2.uploader.destroy(brand.logo.public_id);

        return res.status(200).json({ message: "Brand deleted successfully", data: brand });
    } catch (error) {
        return next(error);
    }
};

export {
    add,
    getAll,
    getById,
    update,
    remove
};
