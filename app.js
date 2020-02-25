const express = require("express");
const app = express();
const paperManager = require('./index')

 
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

});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});