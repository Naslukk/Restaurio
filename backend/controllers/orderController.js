import { createOrder, getAllOrders, getOrderItems, updateOrderStatus } from "../models/orderModel.js"

export const createOrderC = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { table_id, items } = req.body;

        const order = await createOrder({ table_id, user_id, items });
        res.status(201).json({ success: true, message: 'Order placed', order: order });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await getAllOrders();
        res.status(201).json({ success: true, count: orders.length, orders: orders });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const getOrderDetails = async (req, res) => {
    try {
        const items = await getOrderItems(req.params.id);
        res.status(201).json({ success: true, orderDetails: items });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updated = await updateOrderStatus(req.params.id, status);
        res.status(201).json({ success: true, message: 'Order updated successfull ', updatedOrder: updated });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


