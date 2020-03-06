const express = require("express");
const paperManager = require('./index')
const bodyParser = require('body-parser')

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/* app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })) */

app.get("/correction/:id", async (req, res) => {
    let data = await paperManager.correction(req.params.id);
    res.send(data);
    console.log(data)
    //res.sendStatus(200);
})

app.get("/output", async (req, res) => {
    let data = await paperManager.dataOutput();
    res.send(data);
   // console.log(data);
})

app.post("/scopus/parser", async (req, res) => {
    //let data = await paperManager.dataOutput(req.body);
    console.log(req.body)
})

app.listen(4000, () => {
    console.log('Example app listening on port 4000!');
});

/* app.get("/artists", (req, res) => {
    res.send(artists)
})

app.get("/artists/:id", (req, res) => {
    console.log(req.params)
    let artist = artists.find((artist) => {
        return artist.id == req.params.id
    })
    res.send(artist);
})

app.post("/artists", (req, res) => {
    console.log(req.body)
    let artist = {
        id: Date.now(),
        name: req.body.name
    }
    artists.push(artist)
    res.send(artists)
})

app.put("/artists/:id", (req, res) => {
    let artist = artists.find((artist) => {
        return artist.id == req.params.id
    })
    artist.name = req.body.name;
    res.sendStatus(200);
})

app.delete("/artists/:id", (req, res) => {
    artists = artists.filter((artist) => {
        return artist.id != req.params.id; 
    })
    res.sendStatus(200);
})

app.get("/", (req, res) => {
    res.send("Hello World!");
})
 
app.get("/import", async (req, res) => {
    await paperManager.parserAuthors('data/authors.csv');
    await paperManager.parserScopus('data/scopus.csv');
    await paperManager.parserWos('data/savedrecs.csv');
    await paperManager.count();
    
    res.send("Парсим!");
});

app.get("/export", async (req, res) => {
    
    res.send("Экспортируем!");
    await paperManager.dataOutput();

}); */

