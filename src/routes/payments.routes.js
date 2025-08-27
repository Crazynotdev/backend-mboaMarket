import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { initPayment, paymentWebhook } from '../controllers/payments.controller.js';

const router = Router();

// Démarre un paiement pour une commande
router.post('/initiate', auth, initPayment);

// (Airtel/Moov)
router.post('/webhook', paymentWebhook);

export default router;
