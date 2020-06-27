const {
    Author,
    Connection,
    Eids
} = require('./models');
const {
    PaperS
} = require('./models/scopus');
const {
    PaperW,
    ExportW
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
const exportW = new ExportW();
const levenshtein = require('js-levenshtein');
const asyncRedis = require('async-redis');
const client = asyncRedis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

async function main() {
    paperW.model.belongsToMany(author.model, {
        through: connection.model,
        foreignKey: 'paperId'
    })
    author.model.belongsToMany(paperW.model, {
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

    for (let e = 0; e < findAllWos.length; e++) {
        let findEid = oldId.find(item => item.eid == findAllWos[e]['eid']);
        if (!findEid) {
            newEids.push({
                eid: findAllWos[e]['eid']
            })
        }
    }

    for (let i = 0; i < findAllWos.length; i++) {
        let findEid = oldId.find(item => item.eid == findAllWos[i]['eid'])
        if (!findEid) {
            let arrCompare = [];

            let s1 = findAllWos[i]['topic'];

            for (let k = 0; k < findAllScopus.length; k++) {
                let s2 = findAllScopus[k]['topic'];
                let compare = Math.round((s1.length - levenshtein(s1, s2)) / s1.length * 100);
                arrCompare.push(compare)
            }            

            let maxCompare = getMaxOfArray(arrCompare);
            //console.log(maxCompare);

            let journalName = findAllWos[i].journal[0].toUpperCase() + findAllWos[i].journal.toLowerCase().slice(1);

            let paper = {
                Индекс: 'WoS',
                Тип: findAllWos[i].type === "Article" ? "Журнал" : (findAllWos[i].type === "Proceedings Paper" ? "Конференция" : findAllWos[i].type),
                ИФ: '',
                Квартиль: '',
                Издание: journalName,
                Статья: findAllWos[i].topic,
                DOI: findAllWos[i].doi,
                Идентификатор: findAllWos[i].eid.substr(4, 15),
                ID: '',
                Name: '',
                Макрос: maxCompare/100,
                Дубляж: findAllWos[i].ourAuthors,
                Номер: ((findAllWos[i].volume) ? `Volume ${findAllWos[i].volume}` : '') + ((findAllWos[i].volume) && (findAllWos[i].issue) ? `, Issue ${findAllWos[i].issue}` : ((findAllWos[i].issue) ? `Issue ${findAllWos[i].issue}` : '')),
                Страницы: findAllWos[i].pages,
                Автор: ((findAllWos[i]['Authors.alias']) ? findAllWos[i]['Authors.alias'] : findAllWos[i]['ourAuthors']),
                Институт: ((findAllWos[i]['Authors.alias']) ? findAllWos[i]['Authors.inst'] : ''),
                Кафедра: ((findAllWos[i]['Authors.alias']) ? findAllWos[i]['Authors.cathedra'] : ''),
                Год: findAllWos[i].year,
                Pscreen: '',
                Перевод: ((findAllWos[i]['Authors.name']) ? findAllWos[i]['Authors.name'] : findAllWos[i]['ourAuthors'])
            }
            
            newPapers.push(paper)

            if(newPapers.length / newEids.length === 1) {
                let uniqueEids = uniqueArr(newEids);
                await client.set('statusWos', `100% (${uniqueEids.length} Web of Science papers successfully added in ArticlesApp!)`);
            } else {
                await client.set('statusWos', `${Math.round(newPapers.length / newEids.length * 100)}%`)
            }

            let status = await client.get('statusWos')
            console.log(status)
        }
    }

    await exportW.save(newPapers)

    return true;
}

module.exports = main;