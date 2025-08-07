import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  category: String,
});

const Menuitems = mongoose.model("Menuitems", menuItemSchema);

export default Menuitems; // <-- ✅ default export
