const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).render("error", {
      title: "You are not authorized to view this resource.",
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.admin) {
    next();
  } else {
    res.status(401).render("error", {
      title: "Access denied: admin privileges required.",
    });
  }
};

module.exports = { isAuth, isAdmin };
