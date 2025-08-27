import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './config/db.js';
import Message from './models/Message.js';

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_ORIGIN, methods: ['GET', 'POST'] }
});

io.on('connection', (socket) => {
  // Le client joint une room par conversationId
  socket.on('join', ({ conversationId }) => {
    if (conversationId) socket.join(conversationId);
  });

  socket.on('message:send', async (payload, ack) => {
    try {
      const { conversationId, sender, recipients, text } = payload;
      if (!conversationId || !sender || !recipients?.length || !text) {
        throw new Error('Invalid message payload');
      }
      const msg = await Message.create({
        conversationId,
        participants: [sender, ...recipients],
        sender,
        text
      });
      io.to(conversationId).emit('message:new', msg);
      ack && ack({ ok: true, data: msg });
    } catch (err) {
      ack && ack({ ok: false, error: err.message });
    }
  });
});

(async () => {
  await connectDB();
  server.listen(PORT, () => console.log(`API running on :${PORT}`));
})();
