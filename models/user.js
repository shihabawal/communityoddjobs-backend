var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AddressSchema = new Schema({
    country: { type: String, required: true },
    city: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String }
});

var UserSchema = new Schema({
    name: { type: String, required: true },
    address: { type: AddressSchema, required: true },
    contact: { type: Number, required: true },
    location: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    admin: { type: Boolean, required: true },
    created: { type: Date, required: true }
});


// Export the model
module.exports = mongoose.model('User', UserSchema);