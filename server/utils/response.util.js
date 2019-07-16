const processJSONResponse = (res, error, result) => {
    if (error && typeof (error.error) !== 'undefined') {
        switch (error.error['code']) {
        case 11000:
            error.status = 409;
            error.message = error.error['errmsg'];
            break;
        default:
            error.status = 500;
        }

        delete (error.error);
    }

    const response = Object.assign({
        success: !error,
    }, error || result);

    const status = response.status;
    delete (response.status);

    res.status(status).send(response);
};

module.exports = processJSONResponse;
