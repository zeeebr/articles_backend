const parser = require('./parser');
const {
    Author,
    PaperS,
    PaperW,
    Connection,
    Done,
    Eids
} = require('./db');
const {
    levenshtein,
    getMaxOfArray
} = require('./utils');
const author = new Author();
const paperS = new PaperS();
const paperW = new PaperW();
const connection = new Connection();
const eids = new Eids();
let done = new Done();
const log = console.log;

async function main() {
    let eidsData = await parser('data/eids.csv');
    //log(eidsData)

    await eids.save(eidsData)

    paperS.model.belongsToMany(author.model, {
        through: connection.model,
        foreignKey: 'paperId'
    })
    author.model.belongsToMany(paperS.model, {
        through: connection.model,
        foreignKey: 'authorId'
    })

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
    //log(findAllWos)

    let newPapers = [];

    for (let i = 0; i < findAllScopus.length; i++) {
        let findEid = oldId.find(item => item.eid == findAllScopus[i]['eid'])
        if (findEid) {
            //log('Есть в экселе!')
        } else {
            let arrCompare = [];

            let s1 = findAllScopus[i]['topic'];

            for (let k = 0; k < findAllWos.length; k++) {
                let s2 = findAllWos[k]['topic'];
                let compare = levenshtein(s1, s2);
                arrCompare.push(compare)
            }

            let maxCompare = getMaxOfArray(arrCompare);
            log(maxCompare)

            let paper = {
                Индекс: 'Scopus',
                Тип: findAllScopus[i].type,
                ИФ: '',
                Квартиль: '',
                Издание: findAllScopus[i].journal,
                Статья: findAllScopus[i].topic,
                DOI: findAllScopus[i].doi,
                Идентификатор: findAllScopus[i].eid.substr(7, 11),
                ID: '',
                Name: '',
                Макрос: maxCompare,
                Дубляж: '',
                Номер: ((findAllScopus[i].volume) ? `Volume ${findAllScopus[i].volume}` : '') + ((findAllScopus[i].volume) && (findAllScopus[i].issue) ? `, Issue ${+findAllScopus[i].issue}` : ((findAllScopus[i].issue) ? `Issue ${+findAllScopus[i].issue}` : '')),
                Страницы: findAllScopus[i].pages,
                Автор: ((findAllScopus[i]['Authors.alias']) ? findAllScopus[i]['Authors.alias'] : findAllScopus[i]['ourAuthors']),
                Институт: ((findAllScopus[i]['Authors.alias']) ? findAllScopus[i]['Authors.inst'] : ''),
                Кафедра: ((findAllScopus[i]['Authors.alias']) ? findAllScopus[i]['Authors.cathedra'] : ''),
                Год: findAllScopus[i].year
            }

            newPapers.push(paper)
        }
    }

    for (let i = 0; i < findAllWos.length; i++) {
        let findEid = oldId.find(item => item.eid == findAllWos[i]['eid'])
        if (findEid) {
            //log('Есть в экселе!')
        } else {
            let arrCompare = [];

            let s1 = findAllWos[i]['topic'];

            for (let k = 0; k < findAllScopus.length; k++) {
                let s2 = findAllScopus[k]['topic'];
                let compare = levenshtein(s1, s2);
                arrCompare.push(compare)
            }            

            let maxCompare = getMaxOfArray(arrCompare);
            console.log(maxCompare);
            let journalName = findAllWos[i].journal[0].toUpperCase() + findAllWos[i].journal.toLowerCase().slice(1);

            let paper = {
                Индекс: 'WoS',
                Тип: findAllWos[i].type,
                ИФ: '',
                Квартиль: '',
                Издание: journalName,
                Статья: findAllWos[i].topic,
                DOI: findAllWos[i].doi,
                Идентификатор: findAllWos[i].eid.substr(4, 15),
                ID: '',
                Name: '',
                Макрос: maxCompare,
                Дубляж: '',
                Номер: ((findAllWos[i].volume) ? `Volume ${findAllWos[i].volume}` : '') + ((findAllWos[i].volume) && (findAllWos[i].issue) ? `, Issue ${findAllWos[i].issue}` : ((findAllWos[i].issue) ? `Issue ${findAllWos[i].issue}` : '')),
                Страницы: findAllWos[i].pages,
                Автор: ((findAllWos[i]['Authors.alias']) ? findAllWos[i]['Authors.alias'] : findAllWos[i]['ourAuthors']),
                Институт: ((findAllWos[i]['Authors.alias']) ? findAllWos[i]['Authors.inst'] : ''),
                Кафедра: ((findAllWos[i]['Authors.alias']) ? findAllWos[i]['Authors.cathedra'] : ''),
                Год: findAllWos[i].year
            }
            
            newPapers.push(paper)
        }
    }

    //log(newPapers)
    done.save(newPapers)
}

module.exports = main;