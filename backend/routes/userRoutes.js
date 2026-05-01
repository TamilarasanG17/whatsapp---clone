const router = require('express').Router();
const { getUsers } = require('../controllers/userController');

router.get('/:id', getUsers);

module.exports = router;