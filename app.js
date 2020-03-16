const express = require("express");
const env = require('./env.js');
const paperManager = require('./index');
const paperCorrection = require('./correction');
const bodyParser = require('body-parser');
const {
    ExportS,
    ExportW
} = require('./db');
const exportS = new ExportS();

const app = express();

app.use(express.static('public'));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }))

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/correction/findOneScopus/:id", async (req, res) => {
    let data = await paperCorrection.findOneScopus(req.params.id);
    res.send(data);
    //console.log(data)
    //res.sendStatus(200);
})

app.get("/count", async (req, res) => {
    let data = await paperManager.count();
    res.send(data);
    //console.log(data);
})

app.get("/scopus/export", async (req, res) => {
    let data = await exportS.findAll();
    res.send(data);
})

app.post("/scopus/parser", async (req, res) => {
    await paperManager.parserScopus(req.body);
    //console.log(req.body)
    res.send('200')
})

app.listen(env.PORT, () => {
    console.log(`Example app listening on port ${env.PORT}`);
});