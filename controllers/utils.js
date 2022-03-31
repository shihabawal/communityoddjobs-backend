var User = require('../models/user');

exports.checkAdmin = (req, res, callback) => {
    if (req.body.adminId && req.body.adminId) {
        User.findById(req.body.adminId, (err, doc) => {
            if (err) {
                res.send({ status: "error", message: `An error occured. ${err.message && err.message}` });
                console.log(err);
                return;
            } else {
                if (doc) {
                    if (doc.admin) {
                        callback(req, res);
                    } else {
                        res.send({ status: "error", message: 'Not allowed' });
                    }
                } else {
                    res.send({ status: "error", message: 'Not found' });
                }
            }
        });
    } else {
        res.send({ status: "error", message: 'Not admin' });
    }
}