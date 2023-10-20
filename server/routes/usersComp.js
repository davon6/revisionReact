// routes/api.js
const express = require('express');
const usersController = require('../controllers/usersComp');

const router = express.Router();


router.get('/allUsers', usersController.getAllUsersRecordsCont);

module.exports = router;