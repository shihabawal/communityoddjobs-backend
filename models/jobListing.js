var mongoose = require('mongoose');
const UserSchema = require('./user').userSchema;
var Schema = mongoose.Schema;

var JobListingSchema = new Schema({
    employerName: { type: String },
    employerEmail: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    dateOfService: { type: Date },
    ratePerHour: { type: Number },
    created: { type: Date, required: true },
    status: { type: String, required: true },
    applicant: { type: UserSchema }
});

exports.jobListingSchema = JobListingSchema
exports.jobListing = mongoose.model('JobListing', JobListingSchema);