const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ------------------------------------------------------
const productSchema = new Schema({
  name: String,
});

// ------------------------------------------------------
const purchaseSchema = new Schema({
  product: productSchema,
  quantity: Number,
  price: Number,
  date: Date,
  total: Number,
  insertDate: Date,
});

// ------------------------------------------------------
const saleSchema = new Schema({
  product: productSchema,
  quantity: Number,
  price: Number,
  date: Date,
  total: Number,
  bus: String,
  insertDate: Date,
  profit: Number,
});

// ------------------------------------------------------
const stockSchema = new Schema({
  product: productSchema,
  quantity: Number,
  price: Number,
  total: Number,
});

// ------------------------------------------------------
module.exports.Product = mongoose.model("Product", productSchema);
module.exports.Purchase = mongoose.model("Purchase", purchaseSchema);
module.exports.Sale = mongoose.model("Sale", saleSchema);
module.exports.Stock = mongoose.model("Stock", stockSchema);
