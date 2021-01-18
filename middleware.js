module.exports = (req, res, next) => {
  if (
    req.session.username === "username" &&
    req.session.password === "password"
  ) {
    next();
  } else {
    res.redirect("/login");
  }
};
