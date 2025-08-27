import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { createOrder, myOrders, markPaid } from '../controllers/orders.controller.js';

const router = Router();

router.post('/', auth, createOrder);
router.get('/me', auth, myOrders);
router.post('/:id/paid', auth, markPaid);

export default router;
