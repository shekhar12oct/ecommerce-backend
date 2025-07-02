const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdminMiddleware = require('../middlewares/isAdminMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only routes
router.post("/", isAdminMiddleware, createProduct);
router.put("/:id", isAdminMiddleware, updateProduct);
router.delete("/:id", isAdminMiddleware, deleteProduct);

module.exports = router;
