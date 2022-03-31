var User = require('../models/user');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the User controller!');
};

exports.user_create = async function (req, res) {
    // check if user exists and wait
    var email = await User.findOne({ email: req.body.email }).exec();
    if (email) {
        res.send('Email already exists');
        return;
    }

    var user = new User({
        name: req.body.name,
        address: req.body.address,
        contact: req.body.contact,
        email: req.body.email,
        password: req.body.password,
        admin: false,
        created: new Date()
    });

    user.save(function (err, doc) {
        if (err) {
            res.send(`An error occured. ${err.message && err.message}`)
            return;
        } else {
            res.send(doc);
        }
    });
}

exports.admin_create = async function (req, res) {
    var email = await User.findOne({ email: req.body.email }).exec();

    if (email) {
        res.send('Admin email already exists');
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
            res.send(`An error occured. ${err.message && err.message}`)
            return;
        } else {
            res.send('Admin created successfully');
        }
    });
}

exports.login = function (req, res) {
    User.findOne({ email: req.body.email }, (err, doc) => {
        if (err) {
            res.send(`An error occured. ${err.message && err.message}`);
            return;
        } else {
            // if email found ... 
            if (doc) {
                // ... check password
                if (doc.password === req.body.password) {
                    // if correct return user details
                    res.send(doc);
                } else {
                    res.send('Incorrect email or password');
                }
            } else {
                res.send('Incorrect email or password');
            }
        }
    })
}

exports.user_edit = function (req, res) {
    checkAdmin(req, res, (req, res) => {
        User.findOneAndUpdate({ email: req.body.user.email }, { ...req.body.user }, (err) => {
            if (err) {
                res.send(`An error occured. ${err.message && err.message}`);
            } else {
                res.send('Updated successfully')
            }
        });
    });
}

exports.user_email_delete = function (req, res) {
    checkAdmin(req, res, (req, res) => {
        User.findOneAndRemove({ email: req.body.email }, function (err, doc) {
            if (err) {
                res.send(`An error occured. ${err.message && err.message}`)
                return;
            } else {
                res.send('Deleted successfully');
            }
        })
    });
};

exports.user_delete = function (req, res) {
    checkAdmin(req, res, (req, res) => {
        User.findByIdAndRemove(req.params.id, function (err) {
            if (err) {
                res.send(`An error occured. ${err.message && err.message}`)
                return;
            } else {
                res.send('Deleted successfully');
            }
        })
    });
};

var checkAdmin = (req, res, callback) => {
    if (req.body.adminId && req.body.adminId) {
        User.findById(req.body.adminId, (err, doc) => {
            if (err) {
                res.send(`An error occured. ${err.message && err.message}`);
                return;
            } else {
                if (doc) {
                    if (doc.admin) {
                        callback(req, res);
                    } else {
                        res.send('Not allowed');
                    }
                } else {
                    res.send('Not found');
                }
            }
        });
    } else {
        res.send('Not admin');
    }
}