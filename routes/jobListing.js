var express = require('express');
var router = express.Router();

var listing_controller = require('../controllers/jobListing');

// test
router.get('/test', listing_controller.test);

// view one listing
router.get('/:id', listing_controller.listing_view);

// view range of listing
router.get('/', listing_controller.listing_view_range);

// create new listing
router.post('/create', listing_controller.listing_create);

// modify listing
router.put('/:id/edit', listing_controller.listing_edit);

// delete by employer email
router.delete('/delete', listing_controller.listing_email_delete);

// delete by listing id
router.delete('/:id/delete', listing_controller.listing_delete);

module.exports = router;