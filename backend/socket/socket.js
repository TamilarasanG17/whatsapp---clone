const Message = require('../models/Message');

const onlineUsers = new Map();

const socketHandler = (io) => {
    io.on('connection', (socket) => {

        socket.on('add-user', (userId) => {
            onlineUsers.set(userId, socket.id);
        });

        // ✅ Send message
        socket.on('send-msg', async (data) => {
            const { sender, receiver, text } = data;

            if (!text || text.trim() === "") {
                return socket.emit("error-msg", "Message cannot be empty");
            }

            try {
                const newMessage = await Message.create({
                    sender,
                    receiver,
                    text
                });

                // send to receiver
                const receiverSocket = onlineUsers.get(receiver);
                if (receiverSocket) {
                    socket.to(receiverSocket).emit('msg-receive', newMessage);
                }

                // send back to sender
                socket.emit('msg-sent', newMessage);

            } catch (err) {
                console.error(err);
                socket.emit("error-msg", "Failed to send message");
            }
        });

        // ✅ Typing indicator (simple & clean)
        socket.on('typing', ({ sender, receiver }) => {
            const receiverSocket = onlineUsers.get(receiver);
            if (receiverSocket) {
                socket.to(receiverSocket).emit('typing', { sender });
            }
        });

        socket.on('stop-typing', ({ sender, receiver }) => {
            const receiverSocket = onlineUsers.get(receiver);
            if (receiverSocket) {
                socket.to(receiverSocket).emit('stop-typing', { sender });
            }
        });

        // ✅ Disconnect
        socket.on('disconnect', () => {
            for (let [id, sockId] of onlineUsers.entries()) {
                if (sockId === socket.id) {
                    onlineUsers.delete(id);
                    break;
                }
            }
        });
    });
};

module.exports = socketHandler;