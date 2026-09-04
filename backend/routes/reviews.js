import express from 'express';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { product, rating, comment } = req.body;
    const existing = await Review.findOne({ user: req.user._id, product });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      user: req.user._id,
      product,
      rating,
      comment: comment || ''
    });

    const productDoc = await Product.findById(product);
    if (productDoc) {
      const allReviews = await Review.find({ product });
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      productDoc.rating = Math.round(avgRating * 10) / 10;
      productDoc.reviewCount = allReviews.length;
      await productDoc.save();
    }

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
