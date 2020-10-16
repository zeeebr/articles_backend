const {
    Author,
    Connection,
    Eids
} = require('./models');
const {
    PaperS,
    ExportS
} = require('./models/scopus');
const {
    PaperW,
} = require('./models/wos');
const {
    getMaxOfArray,
    uniqueArr
} = require('./utils');
const author = new Author();
const paperS = new PaperS();
const paperW = new PaperW();
const connection = new Connection();
const eids = new Eids();
const exportS = new ExportS();
const levenshtein = require('js-levenshtein');
const asyncRedis = require('async-redis');
const env = require('./env.js');
const client = asyncRedis.createClient({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT
});

client.on("error", function (err) {
    console.log("Error " + err);
});

async function main() {
    paperS.model.belongsToMany(author.model, {
        through: connection.model,
        foreignKey: 'paperId'
    })
    author.model.belongsToMany(paperS.model, {
        through: connection.model,
        foreignKey: 'authorId'
    })

    let findAllScopus = await paperS.findAll(['type', 'journal', 'topic', 'doi', 'eid', 'volume', 'issue', 'pages', 'ourAuthors', 'year'], [{
        all: true
    }]);
    let findAllWos = await paperW.findAll(['type', 'journal', 'topic', 'doi', 'eid', 'volume', 'issue', 'pages', 'ourAuthors', 'year'], [{
        all: true
    }]);
    let oldId = await eids.findAll(['id', 'eid']);

    let newPapers = [];
    let newEids = [];

    for (let e = 0; e < findAllScopus.length; e++) {
        let findEid = oldId.find(item => item.eid == findAllScopus[e]['eid']);
        if (!findEid) {
            newEids.push({
                eid: findAllScopus[e]['eid']
            })
        }
    }

    for (let i = 0; i < findAllScopus.length; i++) {
        let findEid = oldId.find(item => item.eid == findAllScopus[i]['eid'])
        if (!findEid) {
            let arrCompare = [];

            let s1 = findAllScopus[i]['topic'];

            for (let k = 0; k < findAllWos.length; k++) {
                let s2 = findAllWos[k]['topic'];
                let compare = Math.round((s1.length - levenshtein(s1, s2)) / s1.length * 100);
                arrCompare.push(compare)
            }

            let maxCompare = getMaxOfArray(arrCompare);
            //console.log(maxCompare);

            let paper = {
                Индекс: 'Scopus',
                Тип: findAllScopus[i].type === "Article" ? "Журнал" : (findAllScopus[i].type === "Conference Paper" ? "Конференция" : findAllScopus[i].type),
                ИФ: '',
                Квартиль: '',
                Издание: findAllScopus[i].journal,
                Проверка: '',
                Статья: findAllScopus[i].topic,
                DOI: findAllScopus[i].doi,
                Идентификатор: findAllScopus[i].eid.substr(7, 11),
                ID: '',
                Name: '',
                Макрос: maxCompare/100,
                Дубляж: findAllScopus[i].ourAuthors,
                Номер: ((findAllScopus[i].volume) ? `Volume ${findAllScopus[i].volume}` : '') + ((findAllScopus[i].volume) && (findAllScopus[i].issue) ? `, Issue ${+findAllScopus[i].issue}` : ((findAllScopus[i].issue) ? `Issue ${+findAllScopus[i].issue}` : '')),
                Страницы: findAllScopus[i].pages,
                Автор: ((findAllScopus[i]['Authors.alias']) ? findAllScopus[i]['Authors.alias'] : findAllScopus[i]['ourAuthors']),
                Институт: ((findAllScopus[i]['Authors.alias']) ? findAllScopus[i]['Authors.inst'] : ''),
                Кафедра: ((findAllScopus[i]['Authors.alias']) ? findAllScopus[i]['Authors.cathedra'] : ''),
                Год: findAllScopus[i].year,
                Pscreen: '',
                Перевод: findAllScopus[i]['ourAuthors']
            }

            newPapers.push(paper)

            //console.log(newPapers.length / newEids.length)

            if(newPapers.length / newEids.length === 1) {
                let uniqueEids = uniqueArr(newEids);
                await client.set('statusScopus', `100% (${uniqueEids.length} Scopus papers successfully added in ArticlesApp!)`);
            } else {
                await client.set('statusScopus', `${60 + Math.round(newPapers.length / newEids.length * 100 * 0.4)}%`)
            }

            let status = await client.get('statusScopus')
            console.log(status)
        }
    }
  
    await exportS.save(newPapers);
 
    return true;
}

module.exports = main;