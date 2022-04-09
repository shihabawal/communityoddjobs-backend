var User = require('../models/user').User;
var utils = require('./utils');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send({ status: 'success', message: 'Greetings from the User controller!' });
};

exports.user_create = async function (req, res) {
    // check if user exists and wait
    var email = await User.findOne({ email: req.body.email }).exec();
    if (email) {
        res.send({ status: 'error', message: 'Email already exists' });
        return;
    }

    var user = new User({
        name: req.body.name,
        address: req.body.address,
        contact: req.body.contact,
        email: req.body.email,
        password: req.body.password,
        admin: false,
        created: new Date(),
        notifications: []
    });

    user.save(function (err, doc) {
        if (err) {
            res.send({ status: 'error', message: `An error occured. ${err.message && err.message}` })
            return;
        } else {
            res.send({ status: 'success', message: 'User created', data: doc });
        }
    });
}

exports.admin_create = async function (req, res) {
    var email = await User.findOne({ email: req.body.email }).exec();

    if (email) {
        res.send({ status: 'error', message: 'Admin email already exists' });
        return;
    }

    var user = new User({
        name: req.body.name,
        address: req.body.address,
        contact: req.body.contact,
        email: req.body.email,
        password: req.body.password,
        admin: true,
        created: new Date()
    });

    user.save(function (err) {
        if (err) {
            res.send({ status: 'error', message: `An error occured. ${err.message && err.message}` })
            return;
        } else {
            res.send({ status: 'success', message: 'Admin created successfully' });
        }
    });
}

exports.login = function (req, res) {
    User.findOne({ email: req.body.email }, (err, doc) => {
        if (err) {
            res.send({ status: 'error', message: `An error occured. ${err.message && err.message}` });
            return;
        } else {
            // if email found ... 
            if (doc) {
                // ... check password
                if (doc.password === req.body.password) {
                    // if correct return user details
                    res.send({ status: 'success', message: 'Logged in', data: doc });
                } else {
                    res.send({ status: 'error', message: 'Incorrect email or password' });
                }
            } else {
                res.send({ status: 'error', message: 'Incorrect email or password' });
            }
        }
    })
}

exports.user_edit = function (req, res) {
    utils.checkAdmin(req, res, (req, res) => {
        User.findOneAndUpdate({ email: req.body.user.email }, { ...req.body.user }, (err) => {
            if (err) {
                res.send({ status: 'error', message: `An error occured. ${err.message && err.message}` });
            } else {
                res.send({ status: 'success', message: 'Updated successfully' })
            }
        });
    });
}

exports.user_email_delete = function (req, res) {
    utils.checkAdmin(req, res, (req, res) => {
        User.findOneAndRemove({ email: req.body.email }, function (err, doc) {
            if (err) {
                res.send({ status: 'error', message: `An error occured. ${err.message && err.message}` })
                return;
            } else {
                res.send({ status: 'success', message: 'Deleted successfully' });
            }
        })
    });
};

exports.user_delete = function (req, res) {
    utils.checkAdmin(req, res, (req, res) => {
        User.findByIdAndRemove(req.params.id, function (err) {
            if (err) {
                res.send({ status: 'error', message: `An error occured. ${err.message && err.message}` })
                return;
            } else {
                res.send({ status: 'success', message: 'Deleted successfully' });
            }
        })
    });
};

exports.user_clear_notifications = function (req, res) {
    User.findOneAndUpdate({ email: req.body.email },
        { notifications: [] }
        , function (err) {
            if (err) {
                res.send({ status: 'error', message: `An error occured. ${err.message && err.message}` })
            } else {
                res.send({ status: 'success', message: 'Cleared all notifications' })
            }
        })
};