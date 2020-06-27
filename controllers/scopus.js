const {
    ExportS
} = require('../models/scopus');
const exportS = new ExportS();
const paperCorrection = require('../correction');
const paperManager = require('../index');
const asyncRedis = require('async-redis');
const client = asyncRedis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});


exports.export = async (req, res, next) => {
    try {
        let data = await exportS.findAll();
        res.send(data);
    } catch (err) {
        next(err)
    }
}

exports.paper = async (req, res, next) => {
    try {
        let data = await paperCorrection.getScopus(req.params.id);
        res.send(data);
    } catch (err) {
        next(err)
    }
}

exports.connection = async (req, res, next) => {
    try {
        let data = await paperCorrection.getScopusConnecion(req.params.id);
        res.send(data);
    } catch (err) {
        next(err)
    }
}

exports.correction = async (req, res, next) => {
    try {
        await paperCorrection.updateScopus(req.body);
        res.sendStatus(200);
    } catch (err) {
        next(err)
    }
}

exports.parser = async (req, res, next) => {
    try {
        await paperManager.parserScopus(req.body);
        res.sendStatus(200);
    } catch (err) {
        next(err)
    }
}

exports.delete = async (req, res, next) => {
    try {
        await paperCorrection.deleteScopus(req.params.id);
        res.sendStatus(200);
    } catch(err) {
        next(err)
    }
}

exports.status = async (req, res, next) => {
    try {
        let status = await client.get('statusScopus');
        res.send(status);
    } catch (err) {
        next(err)
    }
}