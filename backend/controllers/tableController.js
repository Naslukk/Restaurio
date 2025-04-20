import { createTable, deleteTable, getAllTables, getTableById, updateTable } from "../models/tableModel.js";


export const getTables = async (req, res) => {
    try {
        const tables = await getAllTables();
        res.status(201).json({ success: true, count: tables.length, tables: tables });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const getTable = async (req, res) => {
    try {
        const table = await getTableById(req.params.id);
        if (!table) return res.status(404).json({ message: 'Table not found' });
        res.status(201).json({ success: true, table: table });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const createTableC = async (req, res) => {
    try {
        const newTable = await createTable(req.body);
        res.status(201).json({ success: true, message: "Table added successfully", table: newTable });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const updateTableC = async (req, res) => {
    try {
        const updated = await updateTable(req.params.id, req.body);
        if (!updated) return res.status(404).json({ message: 'Table not found' });
        res.status(201).json({ success: true, message: "Table updatd successfully", updaedTable: updated });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const deleteTableC = async (req, res) => {
    try {
        const deleted = await deleteTable(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Table not found' });
        res.status(201).json({ success: true, message: 'Table deleted', table: deleted });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
