const express = require('express');
const router = express.Router();
const usersController = require('../../../controllers/api/v1/users_controllers');

router.post('/sign-up', usersController.signUp);
router.post('/sign-in', usersController.signIn);

module.exports = router;