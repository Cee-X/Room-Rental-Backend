import { Router } from "express";
import { createRoom, getRooms, getRoomById, updateRoom, deleteRoom, getTopOfferRooms} from '../controller/roomsController';
import { authenticate, isAdmin } from "../middleware/authMiddleware";
import { upload, uploadToGCS } from "../middleware/upload";
const router = Router();
/**
 * @swagger
 * /api/room:
 *   post:
 *     summary: Create a new room
 *     description: This endpoint allows for the creation of a new room. It expects images and amenities among other room details.
 *     tags:
 *       - Rooms
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the room
 *               description:
 *                 type: string
 *                 description: Description of the room
 *               price:
 *                 type: number
 *                 description: Price per night for the room
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Images of the room
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of amenities available in the room
 *     responses:
 *       200:
 *         description: Room created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Room created successfully
 *       400:
 *         description: Error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error creating room
 */

router.post('/',authenticate,isAdmin,upload,uploadToGCS, createRoom);
/**
 * @swagger
 * /api/room:
 *   get:
 *     summary: Get all rooms
 *     description: This endpoint retrieves all the rooms available.
 *     tags:
 *       - Rooms
 *     responses:
 *       200:
 *         description: A list of rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: './src/models/Room'
 *       400:
 *         description: Error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching rooms
 */
router.get('/', getRooms);
/**
 * @swagger
 * /api/room/topOffers:
 *   get:
 *     summary: Get top offer rooms
 *     description: This endpoint retrieves the top 10 rooms marked as top offers.
 *     tags:
 *       - Rooms
 *     responses:
 *       200:
 *         description: A list of top offer rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                $ref: './src/models/Room'
 *       500:
 *         description: Error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error fetching top offer rooms
 */
router.get('/topOffers', getTopOfferRooms)



/**
 * @swagger
 * /api/room/{id}:
 *   get:
 *     summary: Get a room by ID
 *     description: This endpoint retrieves a single room by its unique ID.
 *     tags:
 *       - Rooms
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the room to retrieve
 *     responses:
 *       200:
 *         description: Room found and returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: './src/models/Room'
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Room not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error retrieving room
 */
router.get('/:id', getRoomById);
/**
 * @swagger
 * /api/room/{id}:
 *   put:
 *     summary: Update a room by ID
 *     description: This endpoint updates the details of an existing room by its ID. It supports updating images and amenities among other details.
 *     tags:
 *       - Rooms
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the room to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the room
 *               description:
 *                 type: string
 *                 description: Description of the room
 *               price:
 *                 type: number
 *                 description: Price per night for the room
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: New images of the room
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Updated list of amenities available in the room
 *     responses:
 *       200:
 *         description: Room updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Room updated successfully
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Room not found
 *       500:
 *         description: Error updating room
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error updating room
 */
router.put('/:id',authenticate,isAdmin,upload,uploadToGCS,updateRoom);

/**
 * @swagger
 * /api/room/{id}:
 *   delete:
 *     summary: Delete a room by ID
 *     description: This endpoint deletes a room by its unique ID.
 *     tags:
 *       - Rooms
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the room to delete
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Room deleted successfully
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Room not found
 *       500:
 *         description: Error deleting room
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error deleting room
 */
router.delete('/:id',authenticate,isAdmin,deleteRoom);



export default router;