import { pool } from "../db/db.js"

export const createOrder = async ({ table_id, user_id, items }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderRes = await client.query(
      'INSERT INTO orders (table_id, user_id) VALUES ($1, $2) RETURNING *',
      [table_id, user_id]
    );
    const order = orderRes.rows[0];

    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, item_id, quantity) VALUES ($1, $2, $3)',
        [order.id, item.item_id, item.quantity]
      );
    }

    await client.query('COMMIT');
    return order;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const getAllOrders = async () => {
  const res = await pool.query(`
    SELECT o.*, t.table_number, u.name
    FROM orders o
    JOIN tables t ON o.table_id = t.id
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `);
  return res.rows;
};

export const getOrderItems = async (order_id) => {
  const res = await pool.query(`
    SELECT oi.*, m.name, m.price
    FROM order_items oi
    JOIN menu_items m ON oi.item_id = m.id
    WHERE oi.order_id = $1
  `, [order_id]);
  return res.rows;
};

export const updateOrderStatus = async (order_id, status) => {
  const res = await pool.query(
    'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
    [status, order_id]
  );
  return res.rows[0];
};

