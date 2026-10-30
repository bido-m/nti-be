import { cartModel } from "../../DB/Models/cart.model.js";
import { productModel } from "../../DB/Models/product.model.js";

const addToCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { product_id, quantity = 1 } = req.body;

        if (!product_id) {
            return next(new Error("Product ID is required", { cause: 400 }));
        }

        const qty = Number(quantity);
        if (qty < 1) {
            return next(new Error("Quantity must be at least 1", { cause: 400 }));
        }

        const product = await productModel.findById(product_id);
        if (!product) {
            return next(new Error("Product not found", { cause: 404 }));
        }

        let cart = await cartModel.findOne({ user_id: userId });

        if (!cart) {
            if (product.stock < qty) {
                return next(new Error(`Only ${product.stock} items left in stock`, { cause: 400 }));
            }

            cart = await cartModel.create({
                user_id: userId,
                products: [{ product_id, quantity: qty }]
            });

            return res.status(201).json({ message: "Product added to cart", data: cart });
        }

        const itemIndex = cart.products.findIndex(
            (p) => p.product_id.toString() === product_id.toString()
        );

        if (itemIndex > -1) {
            const newQuantity = cart.products[itemIndex].quantity + qty;

            if (product.stock < newQuantity) {
                return next(new Error(`Cannot add more. Only ${product.stock} items available`, { cause: 400 }));
            }

            cart.products[itemIndex].quantity = newQuantity;
        } else {
            if (product.stock < qty) {
                return next(new Error(`Only ${product.stock} items left in stock`, { cause: 400 }));
            }

            cart.products.push({ product_id, quantity: qty });
        }

        await cart.save();
        return res.status(200).json({ message: "Cart updated successfully", data: cart });
    } catch (error) {
        return next(error);
    }
};


const getCart = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const cart = await cartModel
            .findOne({ user_id: userId })
            .populate("products.product_id", "name price image stock slug");

        if (!cart) {
            return res.status(200).json({ message: "Cart is empty", data: { products: [] }, totalCartPrice: 0 });
        }

        let totalCartPrice = 0;
        for (const item of cart.products) {
            if (item.product_id) {
                totalCartPrice += item.quantity * item.product_id.price;
            }
        }

        return res.status(200).json({
            message: "Success",
            data: cart,
            totalCartPrice
        });
    } catch (error) {
        return next(error);
    }
};


const updateQuantity = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { product_id, quantity } = req.body;

        const qty = Number(quantity);
        if (!product_id || !qty || qty < 1) {
            return next(new Error("Valid product ID and quantity >= 1 are required", { cause: 400 }));
        }

        const product = await productModel.findById(product_id);
        if (!product) {
            return next(new Error("Product not found", { cause: 404 }));
        }

        if (product.stock < qty) {
            return next(new Error(`Only ${product.stock} items available in stock`, { cause: 400 }));
        }

        const cart = await cartModel.findOne({ user_id: userId });
        if (!cart) {
            return next(new Error("Cart not found", { cause: 404 }));
        }

        const item = cart.products.find(
            (p) => p.product_id.toString() === product_id.toString()
        );

        if (!item) {
            return next(new Error("Product not found in cart", { cause: 404 }));
        }

        item.quantity = qty;
        await cart.save();

        return res.status(200).json({ message: "Quantity updated successfully", data: cart });
    } catch (error) {
        return next(error);
    }
};


const removeProductFromCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { product_id } = req.params;

        const cart = await cartModel.findOneAndUpdate(
            { user_id: userId },
            { $pull: { products: { product_id } } },
            { new: true }
        );

        if (!cart) {
            return next(new Error("Cart not found", { cause: 404 }));
        }

        return res.status(200).json({ message: "Product removed from cart", data: cart });
    } catch (error) {
        return next(error);
    }
};


const clearCart = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const cart = await cartModel.findOneAndUpdate(
            { user_id: userId },
            { products: [] },
            { new: true }
        );

        if (!cart) {
            return next(new Error("Cart not found", { cause: 404 }));
        }

        return res.status(200).json({ message: "Cart cleared successfully", data: cart });
    } catch (error) {
        return next(error);
    }
};

export {
    addToCart,
    getCart,
    updateQuantity,
    removeProductFromCart,
    clearCart
};
