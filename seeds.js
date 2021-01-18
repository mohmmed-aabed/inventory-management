const mongoose = require("mongoose");
const { Product, Purchase, Sale, Stock } = require("./schemas");

// ------------------------------------------------------
mongoose.connect("mongodb://localhost:27017/inventory", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("We're connected!");
});

// ------------------------------------------------------
const seedDb = async () => {
  await Product.deleteMany({});
  await Purchase.deleteMany({});
  await Sale.deleteMany({});
  await Stock.deleteMany({});
  console.log("Data deleted!");
};

// ------------------------------------------------------

seedDb().then(() => {
  mongoose.connection.close();
});
