import { reviewModel } from "../../DB/Models/review.model.js";
import { productModel } from "../../DB/Models/product.model.js";

const addReview = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { rating, comment, product_id } = req.body;

        if (!product_id || !comment || rating === undefined) {
            return next(new Error("product_id, comment, and rating are required", { cause: 400 }));
        }

        const numRating = Number(rating);
        if (numRating < 1 || numRating > 5) {
            return next(new Error("Rating must be between 1 and 5", { cause: 400 }));
        }

        const product = await productModel.findById(product_id);
        if (!product) {
            return next(new Error("Product not found", { cause: 404 }));
        }

        const isReviewed = await reviewModel.findOne({ user_id: userId, product_id });
        if (isReviewed) {
            return next(new Error("You have already reviewed this product", { cause: 409 }));
        }

        const review = await reviewModel.create({
            rating: numRating,
            comment,
            user_id: userId,
            product_id
        });

        return res.status(201).json({ message: "Review added successfully", data: review });
    } catch (error) {
        return next(error);
    }
};

const getProductReviews = async (req, res, next) => {
    try {
        const { product_id } = req.params;

        const reviews = await reviewModel
            .find({ product_id })
            .populate("user_id", "name profile")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Success",
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        return next(error);
    }
};

const updateReview = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;
        const { rating, comment } = req.body;

        const review = await reviewModel.findById(id);
        if (!review) {
            return next(new Error("Review not found", { cause: 404 }));
        }

        if (review.user_id.toString() !== userId.toString()) {
            return next(new Error("Unauthorized to update this review", { cause: 403 }));
        }

        if (rating !== undefined) {
            const numRating = Number(rating);
            if (numRating < 1 || numRating > 5) {
                return next(new Error("Rating must be between 1 and 5", { cause: 400 }));
            }
            review.rating = numRating;
        }

        if (comment) {
            review.comment = comment.trim();
        }

        await review.save();

        return res.status(200).json({ message: "Review updated successfully", data: review });
    } catch (error) {
        return next(error);
    }
};

const deleteReview = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;

        const review = await reviewModel.findById(id);
        if (!review) {
            return next(new Error("Review not found", { cause: 404 }));
        }

        if (req.user.role !== "admin" && review.user_id.toString() !== userId.toString()) {
            return next(new Error("Unauthorized to delete this review", { cause: 403 }));
        }

        await reviewModel.findByIdAndDelete(id);

        return res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        return next(error);
    }
};

export {
    addReview,
    getProductReviews,
    updateReview,
    deleteReview
};
