const express = require('express');
const router = express.Router();
const Entry = require('../../models/entry');
const authenticateJwt = require('../models/auth/authenticate');
const controller = require('../base/controller')(Entry);

// Create - csak autentikált felhasználóknak
router.post('/', authenticateJwt, controller.create);

// Read - nyilvános
router.get('/', controller.findAll);
router.get('/:id', controller.findOne);

// Update - csak autentikált felhasználóknak
router.put('/:id', authenticateJwt, controller.update);
router.patch('/:id', authenticateJwt, controller.update);

// Delete - csak autentikált felhasználóknak
router.delete('/:id', authenticateJwt, controller.delete);

module.exports = router;