const paperManager = require('../index');
const asyncRedis = require('async-redis');
const client = asyncRedis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

exports.count = async (req, res, next) => {
    try {
        let data = await client.get('counter');
        //console.log(JSON.parse(data));
        res.send(JSON.parse(data));
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