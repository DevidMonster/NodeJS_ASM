import { user } from '../controllers/user';
import express from 'express';
import checkPermission from '../middlewares/checkPermission';

const router = express.Router()

router.post('/user', checkPermission, user.getUser)
router.put('/user/:id', checkPermission, user.updateProfile)

export default router