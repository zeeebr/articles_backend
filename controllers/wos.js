const {
    ExportW
} = require('../models/wos');
const exportW = new ExportW();
const paperCorrection = require('../correction');
const paperManager = require('../index');
const asyncRedis = require('async-redis');
const client = asyncRedis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

exports.export = async (req, res, next) => {
    try {
        let data = await exportW.findAll();
        res.send(data);
    } catch (err) {
        next(err)
    }
}

exports.paper = async (req, res, next) => {
    try {
        let data = await paperCorrection.getWos(req.params.id);
        res.send(data);
    } catch (err) {
        next(err)
    }
}

exports.connection = async (req, res, next) => {
    try {
        let data = await paperCorrection.getWosConnecion(req.params.id);
        res.send(data);
    } catch (err) {
        next(err)
    }
}

exports.correction = async (req, res, next) => {
    try {
        await paperCorrection.updateWos(req.body);
        res.sendStatus(200);
    } catch (err) {
        next(err)
    }
}

exports.parser = async (req, res, next) => {
    try {
        await paperManager.parserWos(req.body);
        res.sendStatus(200);
    } catch (err) {
        next(err)
    }
}

exports.delete = async (req, res, next) => {
    try {
        await paperCorrection.deleteWos(req.params.id);
        res.sendStatus(200);
    } catch (err) {
        next(err)
    }
}

exports.status = async (req, res, next) => {
    try {
        let status = await client.get('statusWos');
        res.send(status);
    } catch (err) {
        next(err)
    }
}