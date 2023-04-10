import { comment } from '../controllers/comment';
import express from 'express';
import checkPermission from '../middlewares/checkPermission';

const router = express.Router()

router.get('/comments', comment.getComments)
router.post('/comments',comment.addComment)
router.delete('/comments/:id', checkPermission,comment.removeComment)

export default router