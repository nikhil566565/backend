const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: Number,
  description: String,
  image: String,
  rating: Number,
  category: String,
});

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;
