const { Product, Stock } = require("../schemas");

// ------------------------------------------------------
const addProduct = async (req, res, next) => {
  const foundProduct = await Product.findOne({ name: req.body.newProduct });
  if (!foundProduct) {
    const product = new Product({ name: req.body.newProduct });
    await product.save();
    req.flash("success", "Successfully product added!");
    res.redirect("/purchase");
  } else {
    req.flash("error", "Product was added before!");
    res.redirect("/purchase");
  }
};

// ------------------------------------------------------
const showStock = async (req, res, next) => {
  const stocksByQuantity = await Stock.find({}).sort({ quantity: 1 });
  const stocksByAlphabetic = await Stock.find({}).sort({ "product.name": 1 });
  res.render("stock", { stocksByQuantity, stocksByAlphabetic });
};

// ------------------------------------------------------
module.exports = { addProduct, showStock };
