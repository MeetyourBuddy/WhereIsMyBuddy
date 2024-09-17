const express = require('express');
const router = express.Router();
const { luciaMiddleware } = require('../auth.js');
const protectedController = require('../controllers/protected-controller');

/**
 * @swagger
 * /protected:
 *   get:
 *     summary: Protected route
 *     description: This route is only accessible to authenticated users.
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *       401:
 *         description: Not authenticated
 */
router.get('/', luciaMiddleware(), protectedController.getProtected);

module.exports = router;
