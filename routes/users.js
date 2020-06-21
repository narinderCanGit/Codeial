const express = require('express');
const router = express.Router();

const usersConrtoller = require('../controllers/users_controller');

router.get('/profile', usersConrtoller.profile);
router.get('/posts',usersConrtoller.posts);


module.exports = router;