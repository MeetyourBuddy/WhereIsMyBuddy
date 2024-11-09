import express from 'express';
// import { luciaMiddleware } from '../auth.js';
import { getProtected } from '../controllers/protected-controller.js';

const router = express.Router();

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
router.get('/', getProtected());

export default router;
