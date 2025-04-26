import { pool } from "../db/db.js";

export const createBill = async (order_id) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Get order items with price
        const itemsRes = await client.query(`
      SELECT oi.quantity, m.price
      FROM order_items oi
      JOIN menu_items m ON oi.item_id = m.id
      WHERE oi.order_id = $1
    `, [order_id]);

        if (itemsRes.rows.length === 0) throw new Error('No items found for this order');

        // Calculate total
        const total = itemsRes.rows.reduce((sum, item) => {
            return sum + item.quantity * parseFloat(item.price);
        }, 0);

        // Insert bill
        const billRes = await client.query(`
      INSERT INTO bills (order_id, total_amount)
      VALUES ($1, $2)
      RETURNING *
    `, [order_id, total]);

        await client.query('COMMIT');
        return billRes.rows[0];
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

export const getAllBills = async () => {
    const res = await pool.query(`
    SELECT b.*, o.table_id, o.status, o.created_at AS order_time
    FROM bills b
    JOIN orders o ON b.order_id = o.id
    ORDER BY b.created_at DESC
    `);
    return res.rows;
};

export const getBillByOrderId = async (orderId) => {
    const res = await pool.query(`
      SELECT b.*, o.table_id, o.status, o.created_at AS order_time
      FROM bills b
      JOIN orders o ON b.order_id = o.id
      WHERE b.order_id = $1
    `, [orderId]);

    return res.rows[0];
};



