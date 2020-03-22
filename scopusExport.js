const {
    Author,
    PaperS,
    PaperW,
    Connection,
    ExportS,
    Eids
} = require('./db');
const {
    levenshtein,
    getMaxOfArray,
    uniqueArr
} = require('./utils');
const author = new Author();
const paperS = new PaperS();
const paperW = new PaperW();
const connection = new Connection();
const eids = new Eids();
const exportS = new ExportS();

async function main() {
    /* let eidsData = await parser('data/eids.csv');
    log(eidsData)

    await eids.save(eidsData) */

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

    for (let i = 0; i < findAllScopus.length; i++) {
        let findEid = oldId.find(item => item.eid == findAllScopus[i]['eid'])
        if (findEid) {
            //log('Есть в экселе!')
        } else {
            newEids.push({
                eid: findAllScopus[i]['eid']
            })

            let arrCompare = [];

            let s1 = findAllScopus[i]['topic'];

            for (let k = 0; k < findAllWos.length; k++) {
                let s2 = findAllWos[k]['topic'];
                let compare = levenshtein(s1, s2);
                arrCompare.push(compare)
            }

            let maxCompare = getMaxOfArray(arrCompare);
            console.log(maxCompare)

            let paper = {
                Индекс: 'Scopus',
                Тип: findAllScopus[i].type,
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

    //log(newEids)

    /* let uniqueEids = uniqueArr(newEids);
    
    await fs.writeFile('./data/newEids.json', JSON.stringify(uniqueEids))

    let data = await fs.readFile('./data/newEids.json', 'utf-8');
    
    console.log(JSON.parse(data)) */

    //await eids.save(JSON.parse(data))

    await exportS.save(newPapers)

    return true;
}

module.exports = main;