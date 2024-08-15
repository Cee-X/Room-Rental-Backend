
import { Router } from "express";
import { getDashboardData, fetchFilteredRooms, fetchRoomsPages } from "../controller/dashboardController";
import { authenticate,isAdmin } from "../middleware/authMiddleware";


const router = Router();

router.get('/', authenticate, isAdmin, getDashboardData);

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard data
 *     description: This endpoint allows for the retrieval of dashboard data. It returns the total number of rooms, users, bookings, and revenue.
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRooms:
 *                   type: number
 *                   description: Total number of rooms
 *                 totalUsers:
 *                   type: number
 *                   description: Total number of users
 *                 totalBookings:
 *                   type: number
 *                   description: Total number of bookings
 *                 totalRevenue:
 *                   type: number
 *                   description: Total revenue
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */

router.get('/rooms',fetchFilteredRooms);
router.get('/rooms/pages', fetchRoomsPages);
export default router;