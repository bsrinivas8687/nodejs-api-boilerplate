const bcrypt = require('bcrypt');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const hashPassword = (plainPassword, cb) => {
    bcrypt.hash(plainPassword, 10, cb);
};

const comparePasswords = (hashedPassword, plainPassword, cb) => {
    bcrypt.compare(plainPassword, hashedPassword, cb);
};

const saveProfileImage = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const userId = req.user._id.toString();
            const destinationPath = path.join('uploads', 'users', userId);

            fs.mkdir(destinationPath, {
                recursive: true,
            }, (error) => {
                cb(error, destinationPath);
            });
        },
        filename: (req, file, cb) => {
            const filename = file.originalname.split('.').slice(0, -1).join('.') +
                '_' + Date.now().toString() + '.' + file.originalname.split('.').pop();
            cb(null, filename);
        },
    }),
}).single('file');

module.exports = {
    hashPassword,
    comparePasswords,
    saveProfileImage,
};
