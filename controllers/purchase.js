const { Product, Purchase, Stock } = require("../schemas");
const pathExtractor = require("../utilities/pathExtractor");

// ------------------------------------------------------
const renderPurchaseForm = async (req, res, next) => {
  let purchases = await Purchase.find({}).sort({ insertDate: -1 });
  purchases = purchases.slice(0, 10);
  const products = await Product.find({}).sort({ name: 1 });
  res.render("purchase", { purchases, products });
};

// ------------------------------------------------------
const addPurchase = async (req, res, next) => {
  const { productId, quantity, price, date } = req.body.purchase;
  const product = await Product.findById(productId);
  const purchase = new Purchase({
    product: product,
    quantity: quantity,
    price: price,
    date: date,
    total: quantity * price,
    insertDate: new Date(),
  });
  await purchase.save();

  let stock = await Stock.findOne({ product: product });
  if (!stock) {
    stock = new Stock({
      product: product,
      quantity: quantity,
      price: price,
      total: quantity * price,
    });
  } else {
    stock.price =
      (stock.price * stock.quantity + price * quantity) /
      (stock.quantity + Number(quantity));
    stock.quantity += Number(quantity);
    stock.total = stock.price * stock.quantity;
  }
  await stock.save();

  req.flash("success", "Successfully purchase added!");
  res.redirect("/purchase");
};

// ------------------------------------------------------
const deletePurchase = async (req, res, next) => {
  const { purchaseId, productId } = req.params;

  const purchase = await Purchase.findById(purchaseId);
  const product = await Product.findById(productId);
  let stock = await Stock.findOne({ product: product });

  if (stock) {
    if (stock.quantity === purchase.quantity) {
      await Stock.deleteOne(stock);
      await Purchase.deleteOne(purchase);
      req.flash("success", "Successfully purchase deleted!");
    } else if (stock.quantity > purchase.quantity) {
      (stock.price * stock.quantity - purchase.price * purchase.quantity) /
        (stock.quantity - purchase.quantity);
      stock.quantity -= purchase.quantity;
      stock.total = stock.price * stock.quantity;
      await stock.save();
      await Purchase.deleteOne(purchase);
      req.flash("success", "Successfully purchase deleted!");
    } else {
      req.flash(
        "error",
        `Product was partially sold, only ${stock.quantity} pieces are remaining!`
      );
    }
  } else {
    req.flash("error", `Product was  totally sold!`);
  }

  res.redirect(`${pathExtractor(req)}`);
};

// ------------------------------------------------------
module.exports = { renderPurchaseForm, addPurchase, deletePurchase };
