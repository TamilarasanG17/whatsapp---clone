const router = require('express').Router();
const { sendMessage, getMessages } = require('../controllers/messageController');

router.post('/', sendMessage);
router.get('/:senderId/:receiverId', getMessages);

module.exports = router;