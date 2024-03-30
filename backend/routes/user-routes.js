import express from 'express';
import { createUser, getAllUsers, loginUser } from '../controllers/user-controller.js';

const router = express.Router();


router.get('/', getAllUsers)
router.post("/signup", createUser)
router.post("/login", loginUser)

export default router;