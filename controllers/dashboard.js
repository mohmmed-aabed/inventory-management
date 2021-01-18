const { Product, Purchase, Sale, Stock } = require("../schemas");
const currentDate = require("../utilities/dateFunction");

// ------------------------------------------------------
const showHomePage = async (req, res, next) => {
  const { yyyy, mm, dd } = currentDate();
  const beginningOfMonth = yyyy + "-" + mm + "-" + "01";
  const today = yyyy + "-" + mm + "-" + dd;

  let { fromDate, toDate, busNumber } = req.params;
  if (!fromDate || !toDate || !busNumber) {
    fromDate = beginningOfMonth;
    toDate = today;
    busNumber = "All";
  }

  const bus = busNumber === "All" ? "All Buses" : `Bus ${busNumber}`;
  const stocks = await Stock.find({});

  const purchases = await Purchase.find({
    date: { $gte: fromDate, $lte: toDate },
  }).sort({ date: -1 });

  let sales;
  if (busNumber !== "All") {
    sales = await Sale.find({
      date: { $gte: fromDate, $lte: toDate },
      bus: busNumber,
    }).sort({ date: -1 });
  } else {
    sales = await Sale.find({
      date: { $gte: fromDate, $lte: toDate },
    }).sort({ date: -1 });
  }

  const totalOfStocks = stocks.reduce((acc, obj) => {
    return acc + obj.total;
  }, 0);
  const totalOfPurchases = purchases.reduce((acc, obj) => {
    return acc + obj.total;
  }, 0);
  const totalOfSales = sales.reduce((acc, obj) => {
    return acc + obj.total;
  }, 0);
  const totalOfProfits = sales.reduce((acc, obj) => {
    return acc + obj.profit;
  }, 0);

  const data = {
    fromDate,
    toDate,
    bus,
    purchases,
    sales,
    totalOfStocks,
    totalOfPurchases,
    totalOfSales,
    totalOfProfits,
  };

  res.render("home", data);
};

// ------------------------------------------------------
const filterHomePage = (req, res) => {
  const { bus, fromDate, toDate } = req.body;
  res.redirect(`/${fromDate}/${toDate}/${bus}`);
};

// ------------------------------------------------------
const showProductPage = async (req, res, next) => {
  const { yyyy, mm, dd } = currentDate();
  const beginningOfMonth = yyyy + "-" + mm + "-" + "01";
  const today = yyyy + "-" + mm + "-" + dd;

  const { productId } = req.params;
  let { fromDate, toDate, busNumber } = req.params;

  if (!fromDate || !toDate || !busNumber) {
    fromDate = beginningOfMonth;
    toDate = today;
    busNumber = "All";
  }

  const bus = busNumber === "All" ? "All Buses" : `Bus ${busNumber}`;
  const product = await Product.findById(productId);

  const stocks = await Stock.find({ product: product });

  const purchases = await Purchase.find({
    date: { $gte: fromDate, $lte: toDate },
    product: product,
  }).sort({ date: -1 });

  let sales;
  if (busNumber !== "All") {
    sales = await Sale.find({
      date: { $gte: fromDate, $lte: toDate },
      product: product,
      bus: busNumber,
    }).sort({ date: -1 });
  } else {
    sales = await Sale.find({
      date: { $gte: fromDate, $lte: toDate },
      product: product,
    }).sort({ date: -1 });
  }

  const totalOfStocks = stocks.reduce((acc, obj) => {
    return acc + obj.total;
  }, 0);
  const totalOfPurchases = purchases.reduce((acc, obj) => {
    return acc + obj.total;
  }, 0);
  const totalOfSales = sales.reduce((acc, obj) => {
    return acc + obj.total;
  }, 0);
  const totalOfProfits = sales.reduce((acc, obj) => {
    return acc + obj.profit;
  }, 0);

  const data = {
    fromDate,
    toDate,
    bus,
    purchases,
    sales,
    totalOfStocks,
    totalOfPurchases,
    totalOfSales,
    totalOfProfits,
    product,
  };

  res.render("product", data);
};

// ------------------------------------------------------
const filterProductPage = (req, res) => {
  const { productId } = req.params;
  const { bus, fromDate, toDate } = req.body;
  res.redirect(`/products/${productId}/${fromDate}/${toDate}/${bus}`);
};

// ------------------------------------------------------
module.exports = {
  showHomePage,
  filterHomePage,
  showProductPage,
  filterProductPage,
};
