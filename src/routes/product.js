import { product } from '../controllers/product';
import express from 'express';
import checkPermission from '../middlewares/checkPermission';

const router = express.Router()

router.get('/products', product.getAllProducts)
router.get('/products/:id', product.getDetailProducts)
router.delete('/products/:id', checkPermission, product.removeProducts)
router.put('/products/:id', checkPermission, product.patchProducts)
router.post('/products', checkPermission, product.createProducts)

export default router