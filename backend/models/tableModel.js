import {pool} from "../db/db.js";

export const getAllTables = async () => {
  const res = await pool.query('SELECT * FROM tables ORDER BY table_number');
  return res.rows;
};

export const getTableById = async (id) => {
  const res = await pool.query('SELECT * FROM tables WHERE id = $1', [id]);
  return res.rows[0];
};

export const createTable = async ({ table_number, capacity, status }) => {
  const res = await pool.query(
    'INSERT INTO tables (table_number, capacity, status) VALUES ($1, $2, $3) RETURNING *',
    [table_number, capacity, status || 'available']
  );
  return res.rows[0];
};

export const updateTable = async (id, { table_number, capacity, status }) => {
  const res = await pool.query(
    'UPDATE tables SET table_number=$1, capacity=$2, status=$3 WHERE id=$4 RETURNING *',
    [table_number, capacity, status, id]
  );
  return res.rows[0];
};

export const deleteTable = async (id) => {
  const res = await pool.query('DELETE FROM tables WHERE id = $1 RETURNING *', [id]);
  return res.rows[0];
};

