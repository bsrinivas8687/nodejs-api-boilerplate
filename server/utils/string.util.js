const randomString = (length) => {
    const possible = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    let str = '';
    for (let i = 0; i < length; ++i) {
        str += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return str;
};

module.exports = {
    randomString,
};
