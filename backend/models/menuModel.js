import {pool} from "../db/db.js";

export const getAllMenuItems = async () => {
  const result = await pool.query('SELECT * FROM menu_items ORDER BY id');
  return result.rows;
};

export const getMenuItemById = async (id) => {
  const result = await pool.query('SELECT * FROM menu_items WHERE id = $1', [id]);
  return result.rows[0];
};

export const createMenuItem = async ({ name, category, price, available }) => {
  const result = await pool.query(
    'INSERT INTO menu_items (name, category, price, available) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, category, price, available]
  );
  return result.rows[0];
};

export const updateMenuItem = async (id, { name, category, price, available }) => {
  const result = await pool.query(
    `UPDATE menu_items SET name=$1, category=$2, price=$3, available=$4 WHERE id=$5 RETURNING *`,
    [name, category, price, available, id]
  );
  return result.rows[0];
};

export const deleteMenuItem = async (id) => {
  const result = await pool.query('DELETE FROM menu_items WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
