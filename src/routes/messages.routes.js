import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { listMessages } from '../controllers/messages.controller.js';

const router = Router();

// Récupère l'historique d'une conversation
router.get('/:conversationId', auth, listMessages);

export default router;
