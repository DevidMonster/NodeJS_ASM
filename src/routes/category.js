import { category } from '../controllers/category';
import express from 'express';
import checkPermission from '../middlewares/checkpermission';

const router = express.Router()

router.get('/category', category.getAllCategories)
router.get('/category/:id', category.getDetailCategory)
router.delete('/category/:id', checkPermission, category.removeCategories)
router.put('/category/:id', checkPermission, category.patchCategories)
router.post('/category', checkPermission, category.createCategory)

export default router