import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';
import {
  createProduct, listProducts, getProduct, updateProduct, deleteProduct
} from '../controllers/products.controller.js';

const router = Router();

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', auth, upload.array('images', 4), createProduct);
router.put('/:id', auth, upload.array('images', 4), updateProduct);
router.delete('/:id', auth, deleteProduct);

export default router;
