import { category } from '../controllers/category';
import express from 'express';
import checkPermission from '../middlewares/checkpermission';

const router = express.Router()

router.get('/categories', category.getAllCategories)
router.get('/categories/:id', category.getDetailCategory)
router.delete('/categories/:id', checkPermission, category.removeCategories)
router.put('/categories/:id', checkPermission, category.patchCategories)
router.post('/categories', checkPermission, category.createCategory)

export default router