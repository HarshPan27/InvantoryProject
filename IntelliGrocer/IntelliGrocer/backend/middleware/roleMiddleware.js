// middleware/roleMiddleware.js
const checkManager = (req, res, next) => {
    // Example: assume req.user = { username: 'John', role: 'manager' }
    if (req.user && req.user.role === "manager") {
      next();
    } else {
      return res.status(403).json({ message: "Access denied. Manager role required." });
    }
  };
  
  module.exports = checkManager;
  