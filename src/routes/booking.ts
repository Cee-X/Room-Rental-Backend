import { Router } from "express";
import { createBooking, getUserBookings, cancelBooking } from "../controller/bookingController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post('/',authenticate,createBooking);
/**
 * @swagger
 * /api/booking:
 *   post:
 *     summary: Create a new booking
 *     description: This endpoint allows for the creation of a new booking. It checks if the room is available for the selected dates before creating the booking.
 *     tags:
 *       - Bookings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               room:
 *                 type: string
 *                 description: ID of the room being booked
 *               user:
 *                 type: string
 *                 description: ID of the user making the booking
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Start date of the booking
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: End date of the booking
 *               totalPrice:
 *                 type: number
 *                 description: Total price for the booking period
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Booking created successfully
 *       400:
 *         description: Room is not available for the selected dates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Room is not available for the selected dates
 *       500:
 *         description: Error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error creating booking
 */
router.get('/user',authenticate,getUserBookings);
/**
 * @swagger
 * /api/booking/user:
 *   get:
 *     summary: Get bookings for the authenticated user
 *     description: This endpoint retrieves all bookings made by the authenticated user.
 *     tags:
 *       - Bookings
 *     responses:
 *       200:
 *         description: A list of bookings made by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: './src/models/Booking'
 *       500:
 *         description: Error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching user bookings
 */

router.delete('/:id',authenticate,cancelBooking);
/**
 * @swagger
 * /api/booking/{id}:
 *   delete:
 *     summary: Cancel a booking
 *     description: This endpoint allows the authenticated user to cancel a booking by its ID.
 *     tags:
 *       - Bookings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the booking to cancel
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Booking cancelled successfully
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Booking not found
 *       500:
 *         description: Error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error cancelling booking
 */



export default router;