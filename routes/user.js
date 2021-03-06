var express = require("express");
var router = express.Router();

var user_controller = require("../controllers/user");

// test
router.get("/test", user_controller.test);

// view one user
router.get('/:id', user_controller.user_view_by_id);

//search user by name
router.post("/search", user_controller.user_search);

// Get all users
router.post("/get", user_controller.get_all_users);

// create new user
router.post("/create", user_controller.user_create);

// create new admin
router.post("/admincreate", user_controller.admin_create);

// admin and user login
router.post("/login", user_controller.login);

// admin and user login
router.put("/edit", user_controller.user_edit);

//edit by user id
router.put("/:id/edit", user_controller.user_edit_by_id);

// delete by email
router.delete("/delete", user_controller.user_email_delete);

// delete by id
router.delete("/:id/delete", user_controller.user_delete);

// user clear notifications
router.post("/clearnotifications", user_controller.user_clear_notifications);

module.exports = router;
