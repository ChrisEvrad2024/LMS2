import express from 'express';
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo
} from '../controllers/authController.js';
import rateLimit from 'express-rate-limit';
import csrf from 'csurf';
import helmet from 'helmet';

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

router.use(helmet());
router.use('/api/v1/auth', limiter);

router.post('/signup', csrfProtection, signup);
router.post('/login', csrfProtection, login);
router.post('/forgot-password', csrfProtection, forgotPassword);
router.patch('/reset-password/:token', csrfProtection, resetPassword);
router.patch('/update-password', protect, csrfProtection, updatePassword);

export default router;
