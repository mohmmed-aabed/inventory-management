const renderLoginPage = (req, res) => {
  res.render("login");
};

// ------------------------------------------------------
const login = (req, res, next) => {
  const { username, password } = req.body;
  req.session.username = username;
  req.session.password = password;

  if (
    req.session.username === "username" &&
    req.session.password === "password"
  ) {
    res.redirect("/");
  } else {
    req.flash("error", "Incorrect username or password!");
    res.redirect("/login");
  }
};

// ------------------------------------------------------
module.exports = { renderLoginPage, login };
