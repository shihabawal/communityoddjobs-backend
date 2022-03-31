var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JobListingSchema = new Schema({
    employerName: { type: String },
    employerEmail: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    dateOfService: { type: Date },
    ratePerHour: { type: Number },
    created: { type: Date, required: true }
});

module.exports = mongoose.model('JobListing', JobListingSchema);