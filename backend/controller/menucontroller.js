import Menuitems from "../models/Menuitems.js";

export const getMenuItems = async (req, res) => {
  try {
    const items = await Menuitems.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
