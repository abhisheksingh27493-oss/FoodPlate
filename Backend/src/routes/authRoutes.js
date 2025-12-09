// ==================== routes/auth.js ====================
const express = require('express');
const passport = require('passport');
const {
  register,
  login,
  getMe,
  googleCallback,
} = require('../controller/authController');
const { protect } = require('../middleware/auth');
const {
  validateRegister,
  validateLogin,
  handleValidationErrors,
} = require('../middleware/validator');

const router = express.Router();

// Regular auth routes
router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.get('/me', protect, getMe);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  googleCallback
);

module.exports = router;

