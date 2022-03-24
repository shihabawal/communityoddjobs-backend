var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/user');

// test 
router.get('/test', user_controller.test);

// create new user
router.post('/create', user_controller.user_create);

// create new admin
router.post('/admincreate', user_controller.admin_create);

// admin and user login
router.post('/login', user_controller.login);

// admin and user login
router.put('/edit', user_controller.user_edit);

// delete by email
router.delete('/delete', user_controller.user_email_delete);

// delete by id
router.delete('/:id/delete', user_controller.user_delete);

module.exports = router;