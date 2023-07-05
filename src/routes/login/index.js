const express = require('express');
const { generateToken } = require('../../utils/tokensUtils');
const validateLogin = require('./validateLogin');
const { HTTP_OK_STATUS } = require('../../config/constants');

const router = express.Router();

router.post('/', validateLogin, (req, res) => {
  const token = generateToken();
  res.status(HTTP_OK_STATUS).json({ token });
});

module.exports = router;
