import { Router } from "express";
import { getUserProfile, updateUserProfile, deleteUser } from "../controller/userController";
import { authenticate } from "../middleware/authMiddleware";
import { uploadSingle, uploadProfilePicToGCS, uploadToGCS } from "../middleware/upload";


const router = Router();

router.get('/', authenticate, getUserProfile);
router.put('/', authenticate, uploadSingle, uploadProfilePicToGCS, updateUserProfile);
router.delete('/', authenticate, deleteUser);


export default router;