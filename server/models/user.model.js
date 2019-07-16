const mongoose = require('mongoose');
const { xyz } = require('../../database');

const profileImageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'profile_image.png',
    },
    destination: {
        type: String,
        required: true,
        default: 'uploads/default',
    },
    MIME_type: {
        type: String,
        required: true,
        default: 'image/png',
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
    },
    modified_at: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const loginInfoSchema = new mongoose.Schema({
    access_token: {
        type: String,
        required: true,
    },
    refresh_token: {
        type: String,
        required: true,
    },
    remote_address: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
    },
    modified_at: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email_address: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profile_image: {
        type: profileImageSchema,
        required: true,
        default: () => ({}),
    },
    login_infos: [{
        type: loginInfoSchema,
        required: true,
        unique: true,
    }],
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
    },
    modified_at: {
        type: Date,
        required: true,
        default: Date.now,
    },
}, {
    strict: true,
}).index({
    email_address: 1,
});

module.exports = xyz.model('user', userSchema);
