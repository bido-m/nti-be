import { orderModel } from "../../DB/Models/order.model.js";
import { cartModel } from "../../DB/Models/cart.model.js";
import { productModel } from "../../DB/Models/product.model.js";

const createOrder = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const cart = await cartModel.findOne({ user_id: userId }).populate("products.product_id");

        if (!cart || cart.products.length === 0) {
            return next(new Error("Cart is empty", { cause: 400 }));
        }

        const orderProducts = [];
        let total = 0;

        for (const item of cart.products) {
            const product = item.product_id;

            if (!product) {
                return next(new Error("One or more products no longer exist", { cause: 404 }));
            }

            if (product.stock < item.quantity) {
                return next(new Error(`Not enough stock for product: ${product.name}`, { cause: 400 }));
            }

            orderProducts.push({
                product_id: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            });

            total += product.price * item.quantity;
        }

        const order = await orderModel.create({
            user_id: userId,
            products: orderProducts,
            total,
            status: "pending"
        });

        for (const item of cart.products) {
            await productModel.findByIdAndUpdate(item.product_id._id, {
                $inc: { stock: -item.quantity }
            });
        }

        cart.products = [];
        await cart.save();

        return res.status(201).json({ message: "Order placed successfully", data: order });
    } catch (error) {
        return next(error);
    }
};

const getUserOrders = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const orders = await orderModel.find({ user_id: userId }).sort({ createdAt: -1 });

        return res.status(200).json({ message: "Success", count: orders.length, data: orders });
    } catch (error) {
        return next(error);
    }
};

const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const order = await orderModel.findById(id).populate("user_id", "name email phone");

        if (!order) {
            return next(new Error("Order not found", { cause: 404 }));
        }

        if (req.user.role !== "admin" && order.user_id._id.toString() !== userId.toString()) {
            return next(new Error("Unauthorized to access this order", { cause: 403 }));
        }

        return res.status(200).json({ message: "Success", data: order });
    } catch (error) {
        return next(error);
    }
};

const cancelOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const order = await orderModel.findById(id);

        if (!order) {
            return next(new Error("Order not found", { cause: 404 }));
        }

        if (req.user.role !== "admin" && order.user_id.toString() !== userId.toString()) {
            return next(new Error("Unauthorized to cancel this order", { cause: 403 }));
        }

        if (order.status !== "pending") {
            return next(new Error(`Cannot cancel order with status: ${order.status}`, { cause: 400 }));
        }

        for (const item of order.products) {
            await productModel.findByIdAndUpdate(item.product_id, {
                $inc: { stock: item.quantity }
            });
        }

        order.status = "canceled";
        await order.save();

        return res.status(200).json({ message: "Order canceled successfully", data: order });
    } catch (error) {
        return next(error);
    }
};

const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["pending", "completed", "canceled"];
        if (!status || !validStatuses.includes(status)) {
            return next(new Error("Invalid status. Allowed values: pending, completed, canceled", { cause: 400 }));
        }

        const order = await orderModel.findById(id);
        if (!order) {
            return next(new Error("Order not found", { cause: 404 }));
        }

        if (status === "canceled" && order.status !== "canceled") {
            for (const item of order.products) {
                await productModel.findByIdAndUpdate(item.product_id, {
                    $inc: { stock: item.quantity }
                });
            }
        }

        order.status = status;
        await order.save();

        return res.status(200).json({ message: "Order status updated successfully", data: order });
    } catch (error) {
        return next(error);
    }
};

const getAllOrders = async (req, res, next) => {
    try {
        const orders = await orderModel
            .find()
            .populate("user_id", "name email phone")
            .sort({ createdAt: -1 });

        return res.status(200).json({ message: "Success", count: orders.length, data: orders });
    } catch (error) {
        return next(error);
    }
};

export {
    createOrder,
    getUserOrders,
    getOrderById,
    cancelOrder,
    updateOrderStatus,
    getAllOrders
};
