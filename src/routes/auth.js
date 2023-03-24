import express from 'express';
import auth from '../controllers/auth';

const router = express.Router()

router.post('/login', auth.logIn)
router.post('/signup', auth.signUp)

export default router