const paperManager = require('../index');

exports.count = async (req, res, next) => {
    try {
        let data = await paperManager.count();
        res.send(data);
    } catch (err) {
        err.status = 404;
        next(err);
    }
}

exports.eids = async (req, res, next) => {
    try {
        await paperManager.updEids();
        res.sendStatus(200)
    } catch (err) {
        err.status = 404;
        next(err);
    }
}