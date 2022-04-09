var JobListing = require('../models/jobListing');
var utils = require('../controllers/utils');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send({ status: 'success', message: 'Greetings from the Listing controller!' });
};


exports.listing_view = function (req, res) {
    JobListing.findById(req.params.id, function (err, doc) {
        if (err) {
            res.send({ status: 'error', message: `An error occured. ${err.message && err.message}` })
            return;
        } else {
            if (doc)
                res.send({ status: 'success', message: 'Listing found', data: doc });
            else
                res.send({ status: 'success', message: 'Not found' });
        }
    })
};

exports.listing_apply = function (req, res) {
    JobListing.findById(req.params.id, function (err, doc) {
        if (err) {
            res.send({ status: 'error', message: `An error occured. ${err.message && err.message}` })
            return;
        } else {
            if (doc) {
                if (doc.status === 'new' || doc.status === 'unapplied') {
                    JobListing.findOneAndUpdate({ _id: req.params.id },
                        {
                            status: 'applied',
                            applicant: {
                                ...req.body
                            }
                        },
                        function (err) {
                            if (err) {
                                res.send({ status: 'error', message: `An error occured. ${err.message && err.message}` })
                            } else {
                                res.send({ status: 'success', message: 'Applied successfully' })
                            }
                        })
                } else {
                    res.send({ status: 'error', message: 'Listing unavailable' });
                }
            }
            else {
                res.send({ status: 'error', message: 'Not found' });
            }
        }
    })
};

exports.listing_application_approve = function (req, res) {
    utils.checkAdmin(req, res, (req, res) => {
        JobListing.findById(req.params.id, function (err, doc) {
            if (err) {
                res.send({ status: 'error', message: `An error occured. ${err.message && err.message}` })
                return;
            } else {
                if (doc) {
                    if (doc.status === 'applied') {
                        JobListing.findOneAndUpdate({ _id: req.params.id },
                            {
                                status: 'approved',
                            },
                            function (err) {
                                if (err) {
                                    res.send({ status: 'error', message: `An error occured. ${err.message && err.message}` })
                                } else {
                                    res.send({ status: 'success', message: 'Approved successfully' })
                                }
                            })
                    } else if (doc.status === 'approved') {
                        res.send({ status: 'error', message: 'Already approved' });
                    } else {
                        res.send({ status: 'error', message: 'Listing not applied for' });
                    }
                }
                else {
                    res.send({ status: 'error', message: 'Not found' });
                }
            }
        })

    });
};

exports.listing_application_reject = function (req, res) {
    utils.checkAdmin(req, res, (req, res) => {
        JobListing.findById(req.params.id, function (err, doc) {
            if (err) {
                res.send({ status: 'error', message: `An error occured. ${err.message && err.message}` })
                return;
            } else {
                if (doc) {
                    if (doc.status === 'applied') {
                        JobListing.findOneAndUpdate({ _id: req.params.id },
                            {
                                status: 'unapplied',
                                $unset: { applicant: '' }
                            },
                            function (err) {
                                if (err) {
                                    res.send({ status: 'error', message: `An error occured. ${err.message && err.message}` })
                                } else {
                                    res.send({ status: 'success', message: 'Rejected successfully' })
                                }
                            })
                    } else if (doc.status === 'unapplied') {
                        res.send({ status: 'error', message: 'Already rejected' });
                    } else {
                        res.send({ status: 'error', message: 'Listing not applied for' });
                    }
                }
                else {
                    res.send({ status: 'error', message: 'Not found' });
                }
            }
        })

    });
};

exports.listing_view_range = function (req, res) {
    const query = JobListing.where().or([{ status: 'new' }, { status: 'unapplied' }])
    query.find({},
        function (err, doc) {
            if (err) {
                res.send({ status: 'error', message: `An error occured. ${err.message && err.message}` })
                return;
            } else {
                if (doc)
                    res.send({ status: 'success', message: 'Listings found', data: doc });
                else
                    res.send({ status: 'success', message: 'Not found' });
            }
        })
};

exports.listing_search = function (req, res) {
    const query = JobListing.where().or([{ status: 'new' }, { status: 'unapplied' }]).regex('title', `.*${req.body.searchString}.*`)
    query.find({},
        function (err, doc) {
            if (err) {
                res.send({ status: 'error', message: `An error occured. ${err.message && err.message}` })
                return;
            } else {
                if (doc)
                    res.send({ status: 'success', message: 'Listings found', data: doc });
                else
                    res.send({ status: 'success', message: 'Not found' });
            }
        })
};

exports.listing_create = function (req, res) {
    utils.checkAdmin(req, res, (req, res) => {
        var listing = new JobListing({
            employerName: req.body.employerName,
            employerEmail: req.body.employerEmail,
            title: req.body.title,
            description: req.body.description,
            location: req.body.location,
            dateOfService: req.body.dateOfService,
            ratePerHour: req.body.ratePerHour,
            created: new Date(),
            status: 'new'
        });

        listing.save(function (err, doc) {
            if (err) {
                res.send({ status: 'error', message: `An error occured. ${err.message && err.message}` })
                return;
            } else {
                res.send({ status: 'success', message: 'Listing created', data: doc });
            }
        });
    });
}

exports.listing_edit = function (req, res) {
    utils.checkAdmin(req, res, (req, res) => {
        JobListing.findOneAndUpdate({ _id: req.params.id }, { ...req.body.listing }, (err) => {
            if (err) {
                res.send({ status: 'error', message: `An error occured. ${err.message && err.message}` });
            } else {
                res.send({ status: 'success', message: 'Updated successfully' })
            }
        });
    });
}

exports.listing_email_delete = function (req, res) {
    utils.checkAdmin(req, res, (req, res) => {
        JobListing.findOneAndRemove({ employerEmail: req.body.employerEmail }, function (err) {
            if (err) {
                res.send({ status: 'error', message: `An error occured. ${err.message && err.message}` })
                return;
            } else {
                res.send({ status: 'success', message: 'Deleted successfully' });
            }
        })
    });
};

exports.listing_delete = function (req, res) {
    utils.checkAdmin(req, res, (req, res) => {
        JobListing.findByIdAndRemove(req.params.id, function (err) {
            if (err) {
                res.send({ status: 'error', message: `An error occured. ${err.message && err.message}` })
                return;
            } else {
                res.send({ status: 'success', message: 'Deleted successfully' });
            }
        })
    });
};
