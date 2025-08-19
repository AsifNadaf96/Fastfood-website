// backend/controllers/menucontroller.js
import Menuitems from "../models/Menuitems.js";

// Public: get all items
export const getMenuItems = async (req, res) => {
  try {
    const items = await Menuitems.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: add new item
export const addMenuItem = async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }
    const newItem = new Menuitems({ name, description, price, image });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
