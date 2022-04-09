var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AddressSchema = new Schema({
    zip: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    line1: { type: String, required: true },
});

var NotificationsSchema = new Schema({
    // listing: {},
    type: { type: String, require: true },
    title: { type: String, require: true },
    message: { type: String, require: true },
    created: { type: Date }
})

var UserSchema = new Schema({
    name: { type: String, required: true },
    address: { type: AddressSchema, required: true },
    contact: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    admin: { type: Boolean, required: true },
    created: { type: Date, required: true },
    notifications: [NotificationsSchema]
});


// Export the model
exports.userSchema = UserSchema;
exports.User = mongoose.model('User', UserSchema);