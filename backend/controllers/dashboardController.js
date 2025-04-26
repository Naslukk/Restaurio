import { pool } from "../db/db.js";

// Helper: format date for comparison
const formatDate = (daysAgo = 0) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
};

export const getDashboardStats = async (req, res) => {
    try {
        const client = await pool.connect();

        // Total revenue today
        const today = formatDate(0);
        const revenueToday = await client.query(`
      SELECT COALESCE(SUM(total_amount), 0) AS total
      FROM bills
      WHERE DATE(created_at) = $1
    `, [today]);

        // Revenue this week
        const sevenDaysAgo = formatDate(7);
        const revenueWeek = await client.query(`
      SELECT COALESCE(SUM(total_amount), 0) AS total
      FROM bills
      WHERE created_at >= $1
    `, [sevenDaysAgo]);

        // Revenue this month
        const thisMonthStart = new Date();
        thisMonthStart.setDate(1);
        const revenueMonth = await client.query(`
      SELECT COALESCE(SUM(total_amount), 0) AS total
      FROM bills
      WHERE created_at >= $1
    `, [thisMonthStart]);

        // Total orders
        const totalOrders = await client.query(`SELECT COUNT(*) FROM orders`);

        // Top selling items
        const topItems = await client.query(`
      SELECT m.name, SUM(oi.quantity) AS total_sold
      FROM order_items oi
      JOIN menu_items m ON oi.item_id = m.id
      GROUP BY m.name
      ORDER BY total_sold DESC
      LIMIT 5
    `);

        // Daily revenue (last 7 days)
        const dailySales = await client.query(`
        SELECT 
          DATE(created_at) AS day, 
          COUNT(*) AS total_orders,
          SUM(total_amount) AS total_revenue
        FROM bills
        WHERE created_at >= $1
        GROUP BY day
        ORDER BY day ASC
      `, [sevenDaysAgo]);

        client.release();

        res.json({
            revenue: {
                today: parseFloat(revenueToday.rows[0].total),
                week: parseFloat(revenueWeek.rows[0].total),
                month: parseFloat(revenueMonth.rows[0].total),
            },
            totalOrders: parseInt(totalOrders.rows[0].count),
            topItems: topItems.rows,
            dailySales: dailySales.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
