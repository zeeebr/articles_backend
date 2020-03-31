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
const exportW = new ExportW();

const app = express();

app.use(express.static('public'));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }))

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

app.get("/count", async (req, res) => {
    try {
        let data = await paperManager.count();
        res.send(data);
    } catch (err) {
        res.sendStatus(404)
    }
})

app.get("/scopus/export", async (req, res) => {
    let data = await exportS.findAll();
    res.send(data);
})

app.get("/wos/export", async (req, res) => {
    let data = await exportW.findAll();
    res.send(data);
})

app.get("/correction/scopus/:id", async (req, res) => {
    let data = await paperCorrection.getScopus(req.params.id);
    res.send(data);
})

app.get("/correction/scopus/connection/:id", async (req, res) => {
    let data = await paperCorrection.getScopusConnecion(req.params.id);
    res.send(data);
})

app.get("/correction/wos/:id", async (req, res) => {
    let data = await paperCorrection.getWos(req.params.id);
    res.send(data);
})

app.get("/correction/wos/connection/:id", async (req, res) => {
    let data = await paperCorrection.getWosConnecion(req.params.id);
    res.send(data);
})

app.put("/correction/scopus/", async (req, res) => {
    await paperCorrection.updateScopus(req.body);
    res.sendStatus(200);
})

app.put("/correction/wos/", async (req, res) => {
    await paperCorrection.updateWos(req.body);
    res.sendStatus(200);
})

app.put("/eids", async (req, res) => {
    await paperManager.updEids();
    res.sendStatus(200)
})

app.post("/scopus/parser", async (req, res) => {
    await paperManager.parserScopus(req.body);
    res.send('200')
})

app.post("/wos/parser", async (req, res) => {
    await paperManager.parserWos(req.body);
    res.send(200)
})

app.delete("/delete/scopus/:id", async (req, res) => {
    console.log(req.params.id)
    await paperCorrection.deleteScopus(req.params.id)
})

app.delete("/delete/wos/:id", async (req, res) => {
    console.log(req.params.id)
    await paperCorrection.deleteWos(req.params.id)
})

app.listen(env.PORT, () => {
    console.log(`App listening on port ${env.PORT}`);
});