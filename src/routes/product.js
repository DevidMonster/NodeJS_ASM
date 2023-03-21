import { product } from '../controllers/product';
import express from 'express';

const router = express.Router()

router.get('/products', product.getAllProducts)
router.get('/products/:id', product.getDetailProducts)
router.delete('/products/:id', product.removeProducts)
router.put('/products/:id', product.patchProducts)
router.post('/products', product.createProducts)

export default router