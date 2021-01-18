const { Product, Sale, Stock } = require("../schemas");
const pathExtractor = require("../utilities/pathExtractor");

// ------------------------------------------------------
const renderSaleForm = async (req, res, next) => {
  let sales = await Sale.find({}).sort({ insertDate: -1 });
  sales = sales.slice(0, 10);
  const stocks = await Stock.find({}).sort({ "product.name": 1 });
  res.render("sale", { sales, stocks });
};

// ------------------------------------------------------
const addSale = async (req, res, next) => {
  const { productId, quantity, price, date, bus } = req.body.sale;
  const product = await Product.findById(productId);
  const sale = new Sale({
    product: product,
    quantity: quantity,
    price: price,
    total: quantity * price,
    date: date,
    bus: bus,
    insertDate: new Date(),
  });

  let stock = await Stock.findOne({ product: product });
  if (quantity <= stock.quantity) {
    sale.profit = quantity * (Number(price) - stock.price);
    await sale.save();

    if (quantity < stock.quantity) {
      stock.quantity -= Number(quantity);
      stock.total = stock.quantity * stock.price;
      await stock.save();
    } else {
      await Stock.deleteOne(stock);
    }
    req.flash("success", "Successfully sale added!");
    res.redirect("/sale");
  } else {
    req.flash("error", `You do not have enough pieces!`);
    res.redirect("/sale");
  }
};

// ------------------------------------------------------
const deleteSale = async (req, res, next) => {
  const { saleId, productId } = req.params;

  const sale = await Sale.findById(saleId);
  const product = await Product.findById(productId);
  let stock = await Stock.findOne({ product: product });
  const costPrice = sale.price - sale.profit / sale.quantity;

  if (stock) {
    stock.price =
      (stock.price * stock.quantity + costPrice * sale.quantity) /
      (stock.quantity + sale.quantity);
    stock.quantity += sale.quantity;
    stock.total = stock.price * stock.quantity;
  } else {
    stock = new Stock({
      product: product,
      quantity: sale.quantity,
      price: costPrice,
      total: sale.quantity * costPrice,
    });
  }

  await stock.save();
  await Sale.deleteOne(sale);

  req.flash("success", "Successfully sale deleted!");
  res.redirect(`${pathExtractor(req)}`);
};

// ------------------------------------------------------
module.exports = { renderSaleForm, addSale, deleteSale };
