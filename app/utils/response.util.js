const processJSONResponse = (res, error, result) => {
    console.log(res, error, result);
    const response = Object.assign({
        success: !error,
    }, error || result);

    if (typeof (response.status) === 'undefined') {
        response.status = 500;
    }

    const status = response.status;
    delete (response.status);

    res.status(status).send(response);
};

module.exports = processJSONResponse;
