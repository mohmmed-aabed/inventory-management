if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo")(session);
const catchAsync = require("./utilities/catchAsync");
const isLoogedIn = require("./middleware");

const app = express();

const dbUrl = "mongodb://localhost:27017/stock";
// const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/stock";
const secret = process.env.SECRET || "thisshouldbebettersecret";

// ------------------ CONTROLLERS ------------------
const {
  renderPurchaseForm,
  addPurchase,
  deletePurchase,
} = require("./controllers/purchase");

const { renderSaleForm, addSale, deleteSale } = require("./controllers/sale");

const {
  showHomePage,
  filterHomePage,
  showProductPage,
  filterProductPage,
} = require("./controllers/dashboard");

const { addProduct, showStock } = require("./controllers/product");
const { renderLoginPage, login } = require("./controllers/login");

// ------------------ MONGOOSE ------------------
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("We're connected!");
});

// ------------------ MIDDLEWARE ------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// ------------------ SESSION / FLASH ------------------
const store = new MongoStore({
  url: dbUrl,
  secret: secret,
  touchAfter: 24 * 60 * 60,
});

const sessionConfig = {
  store,
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// ------------------ LOGIN ------------------
app.get("/login", renderLoginPage);

app.post("/login", login);

// ------------------ MIDDLEWARE ------------------
app.use(isLoogedIn);

// ------------------ PURCHASE ------------------
app.get("/purchase", catchAsync(renderPurchaseForm));

app.post("/purchase", catchAsync(addPurchase));

app.delete("/purchase/:purchaseId/:productId", catchAsync(deletePurchase));

// ------------------ SALE ------------------
app.get("/sale", catchAsync(renderSaleForm));

app.post("/sale", catchAsync(addSale));

app.delete("/sale/:saleId/:productId", catchAsync(deleteSale));

// ------------------ PRODUCT / STOCK ------------------
app.post("/product", catchAsync(addProduct));

app.get("/stock", catchAsync(showStock));

// ------------------ DASHBOARD - PRODUCT ------------------
app.get(
  "/products/:productId/:fromDate?/:toDate?/:busNumber?",
  catchAsync(showProductPage)
);

app.post("/products/:productId", filterProductPage);

// ------------------ DASHBOARD - HOME ------------------
app.get("/:fromDate?/:toDate?/:busNumber?", catchAsync(showHomePage));

app.post("/", filterHomePage);

// ------------------ ERRORS HANDLING ------------------
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something Went Wrong!" } = err;
  res.status(statusCode).send(message);
});

// ------------------ PORT ------------------
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
