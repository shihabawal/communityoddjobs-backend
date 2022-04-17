var JobListing = require("../models/jobListing").jobListing;
var User = require("../models/user").User;
var utils = require("../controllers/utils");

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send({
        status: "success",
        message: "Greetings from the Listing controller!",
    });
};

exports.listing_view = function (req, res) {
    JobListing.findById(req.params.id, function (err, doc) {
        if (err) {
            res.send({
                status: "error",
                message: `An error occured. ${err.message && err.message}`,
            });
            return;
        } else {
            if (doc)
                res.send({ status: "success", message: "Listing found", data: doc });
            else res.send({ status: "success", message: "Not found" });
        }
    });
};

exports.listing_apply = async function (req, res) {
    const user = await User.find({ email: req.body.email }).exec();
    // check if user exists
    if (!user) {
        res.send({ status: "error", message: "Not a user" });
        return;
    }
    JobListing.findById(req.params.id, async function (err, doc) {
        if (err) {
            res.send({
                status: "error",
                message: `An error occured. ${err.message && err.message}`,
            });
            return;
        } else {
            if (doc) {
                if (doc.status === "new" || doc.status === "unapplied") {
                    var listing = await JobListing.findOneAndUpdate(
                        { _id: req.params.id },
                        {
                            status: "applied",
                            applicant: {
                                ...req.body,
                            },
                        }
                    ).exec();
                    if (!listing) {
                        res.send({
                            status: "error",
                            message: `An error occured. ${err.message && err.message}`,
                        });
                        return;
                    }
                    var user = await User.findOneAndUpdate(
                        { email: req.body.email },
                        {
                            $push: {
                                notifications: {
                                    type: "application",
                                    title: "Job application",
                                    message: `You have applied for "${listing.title}"`,
                                    created: Date(),
                                },
                            },
                        }
                    ).exec();
                    if (!user) {
                        res.send({
                            status: "error",
                            message: `An error occured. ${err.message && err.message}`,
                        });
                        return;
                    }
                    res.send({ status: "success", message: "Applied successfully" });
                } else {
                    res.send({ status: "error", message: "Listing unavailable" });
                }
            } else {
                res.send({ status: "error", message: "Not found" });
            }
        }
    });
};

exports.listing_application_approve = function (req, res) {
    utils.checkAdmin(req, res, (req, res) => {
        JobListing.findById(req.params.id, function (err, doc) {
            if (err) {
                res.send({
                    status: "error",
                    message: `An error occured. ${err.message && err.message}`,
                });
                return;
            } else {
                if (doc) {
                    if (doc.status === "applied") {
                        JobListing.findOneAndUpdate(
                            { _id: req.params.id },
                            {
                                status: "approved",
                            },
                            async function (err) {
                                if (err) {
                                    res.send({
                                        status: "error",
                                        message: `An error occured. ${err.message && err.message}`,
                                    });
                                } else {
                                    var user = await User.findOneAndUpdate(
                                        { email: doc.applicant.email },
                                        {
                                            $push: {
                                                notifications: {
                                                    type: "acceptance",
                                                    title: "Job application accepted",
                                                    message: `You have been accepted for "${doc.title}"`,
                                                    created: Date(),
                                                },
                                            },
                                        }
                                    ).exec();
                                    if (!user) {
                                        res.send({
                                            status: "error",
                                            message: `An error occured. ${err.message && err.message
                                                }`,
                                        });
                                    }
                                    res.send({
                                        status: "success",
                                        message: "Approved successfully",
                                    });
                                }
                            }
                        );
                    } else if (doc.status === "approved") {
                        res.send({ status: "error", message: "Already approved" });
                    } else {
                        res.send({ status: "error", message: "Listing not applied for" });
                    }
                } else {
                    res.send({ status: "error", message: "Not found" });
                }
            }
        });
    });
};

exports.listing_application_reject = function (req, res) {
    utils.checkAdmin(req, res, (req, res) => {
        JobListing.findById(req.params.id, function (err, doc) {
            if (err) {
                res.send({
                    status: "error",
                    message: `An error occured. ${err.message && err.message}`,
                });
                return;
            } else {
                if (doc) {
                    if (doc.status === "applied") {
                        JobListing.findOneAndUpdate(
                            { _id: req.params.id },
                            {
                                status: "unapplied",
                                $unset: { applicant: "" },
                            },
                            async function (err) {
                                if (err) {
                                    res.send({
                                        status: "error",
                                        message: `An error occured. ${err.message && err.message}`,
                                    });
                                } else {
                                    var user = await User.findOneAndUpdate(
                                        { email: doc.applicant.email },
                                        {
                                            $push: {
                                                notifications: {
                                                    type: "rejection",
                                                    title: "Job application rejected",
                                                    message: `You have been rejected for "${doc.title}"`,
                                                    created: Date(),
                                                },
                                            },
                                        }
                                    ).exec();
                                    if (!user) {
                                        res.send({
                                            status: "error",
                                            message: `An error occured. ${err.message && err.message
                                                }`,
                                        });
                                    }
                                    res.send({
                                        status: "success",
                                        message: "Rejected successfully",
                                    });
                                }
                            }
                        );
                    } else if (doc.status === "unapplied") {
                        res.send({ status: "error", message: "Already rejected" });
                    } else {
                        res.send({ status: "error", message: "Listing not applied for" });
                    }
                } else {
                    res.send({ status: "error", message: "Not found" });
                }
            }
        });
    });
};

exports.listing_view_range = function (req, res) {
    const query = JobListing.where().or([
        { status: "new" },
        { status: "unapplied" },
    ]);
    query.find({}, function (err, doc) {
        if (err) {
            res.send({
                status: "error",
                message: `An error occured. ${err.message && err.message}`,
            });
            return;
        } else {
            if (doc)
                res.send({ status: "success", message: "Listings found", data: doc });
            else res.send({ status: "success", message: "Not found" });
        }
    });
};

exports.listing_search = function (req, res) {
    // const query = JobListing.where().or([{ status: 'new' }, { status: 'unapplied' }]).regex('title', `/.*${req.body.searchString}.*/i`)
    var searchWords = req.body.searchString.split(" ");
    let searchString = "";
    searchWords.forEach((el, i) => { searchString += `${(i === 0) ? "" : "|"}(${el})` });
    JobListing.find(
        {
            $and: [
                { $or: [{ status: "new" }, { status: "unapplied" }] },
                {
                    $or: [
                        { metaTags: { $regex: `.*${searchString}.*`, $options: "i" } },
                        { location: { $regex: `.*${searchString}.*`, $options: "i" } }
                    ]
                },
            ]
        },
        function (err, doc) {
            if (err) {
                res.send({
                    status: "error",
                    message: `An error occured. ${err.message && err.message}`,
                });
                return;
            } else {
                if (doc)
                    res.send({ status: "success", message: "Listings found", data: doc });
                else res.send({ status: "success", message: "Not found" });
            }
        }
    );
};

exports.listing_applications = function (req, res) {
    var searchWords = req.body.searchString.split(" ");
    let searchString = "";
    searchWords.forEach((el, i) => { searchString += `${(i === 0) ? "" : "|"}(${el})` });
    var queryString = {
        $and: [
            { status: "applied" },
            {
                $or: [
                    { metaTags: { $regex: `.*${searchString}.*`, $options: "i" } },
                    { location: { $regex: `.*${searchString}.*`, $options: "i" } }
                ]
            }
        ]
    }
    if (req.body.startDate) {
        queryString.$and.push({ dateOfService: { $gt: req.body.startDate && req.body.startDate } })
    }
    if (req.body.stopDate) {
        queryString.$and.push({ dateOfService: { $lt: req.body.stopDate && req.body.stopDate } })
    }

    JobListing.find(
        {
            ...queryString
        },
        function (err, doc) {
            if (err) {
                res.send({
                    status: "error",
                    message: `An error occured. ${err.message && err.message}`,
                });
                return;
            } else {
                if (doc)
                    res.send({
                        status: "success",
                        message: "Applications found",
                        data: doc,
                    });
                else res.send({ status: "success", message: "Not found" });
            }
        }
    );
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
            status: "new",
        });

        listing.save(function (err, doc) {
            if (err) {
                res.send({
                    status: "error",
                    message: `An error occured. ${err.message && err.message}`,
                });
                return;
            } else {
                res.send({ status: "success", message: "Listing created", data: doc });
            }
        });
    });
};

exports.listing_edit = function (req, res) {
    utils.checkAdmin(req, res, (req, res) => {
        JobListing.findOneAndUpdate(
            { _id: req.params.id },
            { ...req.body.listing },
            (err) => {
                if (err) {
                    res.send({
                        status: "error",
                        message: `An error occured. ${err.message && err.message}`,
                    });
                } else {
                    res.send({ status: "success", message: "Updated successfully" });
                }
            }
        );
    });
};

exports.listing_email_delete = function (req, res) {
    utils.checkAdmin(req, res, (req, res) => {
        JobListing.findOneAndRemove(
            { employerEmail: req.body.employerEmail },
            function (err) {
                if (err) {
                    res.send({
                        status: "error",
                        message: `An error occured. ${err.message && err.message}`,
                    });
                    return;
                } else {
                    res.send({ status: "success", message: "Deleted successfully" });
                }
            }
        );
    });
};

exports.listing_delete = function (req, res) {
    utils.checkAdmin(req, res, (req, res) => {
        JobListing.findByIdAndRemove(req.params.id, function (err) {
            if (err) {
                res.send({
                    status: "error",
                    message: `An error occured. ${err.message && err.message}`,
                });
                return;
            } else {
                res.send({ status: "success", message: "Deleted successfully" });
            }
        });
    });
};
