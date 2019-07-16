const User = require('../models/user.model');

const populatePaths = [];

const save = (doc, cb) => {
    const user = new User(doc);
    user.save((error) => {
        if (error) {
            cb(error);
        } else {
            User.populate(user, populatePaths, cb);
        }
    });
};

const findOne = (conditions, projections, options, cb) => {
    User.findOne(conditions, projections, options)
        .populate(populatePaths)
        .exec({}, cb);
};

const find = (conditions, projections, options, cb) => {
    User.find(conditions, projections, options)
        .populate(populatePaths)
        .exec({}, cb);
};

const findOneAndUpdate = (conditions, update, options, cb) => {
    User.findOneAndUpdate(conditions, update, options)
        .populate(populatePaths)
        .exec({}, cb);
};

const findOneAndDelete = (conditions, options, cb) => {
    User.findOneAndDelete(conditions, options)
        .populate(populatePaths)
        .exec({}, cb);
};

module.exports = {
    save,
    findOne,
    find,
    findOneAndUpdate,
    findOneAndDelete,
};
