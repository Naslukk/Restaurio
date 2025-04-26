import PDFDocument from 'pdfkit';
import fsp from 'fs/promises';
import fs from 'fs'
import path from 'path';
import { pool } from '../db/db.js';


export const generateBillPDF = async (order_id) => {
  const client = await pool.connect();
  try {
    // Fetch order info
    const orderRes = await client.query(`
      SELECT o.id AS order_id, o.created_at, t.table_number AS table_number
      FROM orders o
      JOIN tables t ON o.table_id = t.id
      WHERE o.id = $1
    `, [order_id]);

    if (!orderRes.rows.length) throw new Error('Order not found');
    const order = orderRes.rows[0];

    // Fetch items
    const itemsRes = await client.query(`
      SELECT m.name, m.price, oi.quantity
      FROM order_items oi
      JOIN menu_items m ON oi.item_id = m.id
      WHERE oi.order_id = $1
    `, [order_id]);

    const items = itemsRes.rows;

    const doc = new PDFDocument();
    const uploadDir = path.resolve("bills");
    await fsp.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, `bill_${ order_id}.pdf`);
    // const filePath = path.join(__dirname, `../bills/bill_${order_id}.pdf`);
    doc.pipe(fs.createWriteStream(filePath));

    // Header
    doc.fontSize(20).text('Restaurant Bill', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Order ID: ${order.order_id}`);
    doc.text(`Table: ${order.table_number}`);
    doc.text(`Date: ${new Date(order.created_at).toLocaleString()}`);
    doc.moveDown();

  let total = 0;
  doc.table({
    rowStyles: (i) => {
      return i < 1 ? { border: [0, 0, 1, 0] } : { border: false };
    },
    data: [
      ["Item", "Qty", "Price", "Total"], // Header row
      ...items.map(item => {
        const itemTotal = item.quantity * parseFloat(item.price);
        total += itemTotal;
        return [item.name, item.quantity, item.price, itemTotal];
      }),
    ],
  });

    doc.moveDown();
    doc.fontSize(14).text(`Total Amount: Rs. ${total.toFixed(2)}`, { align: 'right' });

    doc.end();
    return filePath;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    client.release();
  }
};

