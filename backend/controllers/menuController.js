import {createMenuItem,deleteMenuItem,getAllMenuItems,getMenuItemById,updateMenuItem} from "../models/menuModel.js";

export const getMenu = async (req, res) => {
  try {
    const items = await getAllMenuItems();
    res.status(201).json({success: true,count:items.length,items:items});
  } catch (err) {
    res.status(500).json({ success: false,error: err.message });
  }
};

export const getMenuItem = async (req, res) => {
  try {
    const item = await getMenuItemById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(201).json({success: true,item:item});
  } catch (err) {
    res.status(500).json({ success: false,error: err.message });
  }
};

export const createMenuItemC = async (req, res) => {
  try {
    const newItem = await createMenuItem(req.body);
    res.status(201).json({success: true,message:"item added successfully",item:newItem});
  } catch (err) {
    res.status(500).json({ success: false,error: err.message });
  }
};

export const updateMenuItemC = async (req, res) => {
  try {
    const updated = await updateMenuItem(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Item not found' });
    res.status(201).json({success: true,message:"item updated successfully",updatedItem:updated});
  } catch (err) {
    res.status(500).json({success: false, error: err.message });
  }
};

export const deleteMenuItemC = async (req, res) => {
  try {
    const deleted = await deleteMenuItem(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Item not found' });
    res.json({ success: true,message: 'Item deleted', item: deleted });
  } catch (err) {
    res.status(500).json({ success: false,error: err.message });
  }
};

