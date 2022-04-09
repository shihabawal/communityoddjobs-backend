var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AddressSchema = new Schema({
    zip: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    line1: { type: String, required: true },
});

var UserSchema = new Schema({
    name: { type: String, required: true },
    address: { type: AddressSchema, required: true },
    contact: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    admin: { type: Boolean, required: true },
    created: { type: Date, required: true }
});


// Export the model
exports.userSchema = UserSchema;
exports.User = mongoose.model('User', UserSchema);