import { createBill, getAllBills, getBillByOrderId } from '../models/billModel.js'
import { generateBillPDF } from '../until/pdfGenerator.js';

export const generateBill = async (req, res) => {
    try {
        const bill = await createBill(req.params.order_id);
        res.status(201).json({ success: true, message: 'Bill generated', bill:bill });
    } catch (err) {
        res.status(400).json({ success: false,  error: err.message });
    }
};

export const getBills = async (req, res) => {
    try {
        const bills = await getAllBills();
        res.status(201).json({ success: true, count : bills.length , bills:bills });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const getBillByOrder = async (req, res) => {
    try {
        const bill = await getBillByOrderId(req.params.order_id);
        res.status(201).json({ success: true, bill:bill });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
export const downloadBillPDF = async (req, res) => {
    try {
      const filePath = await generateBillPDF(req.params.order_id);
      res.status(201).json({ success: true,message:"Bill downloaded" });
      res.download(filePath);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

