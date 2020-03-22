const {
    Author,
    PaperS,
    PaperW,
    Connection,
    ExportW,
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
const exportW = new ExportW();

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
    //log(findAllWos)

    let newPapers = [];
    let newEids = [];

    for (let i = 0; i < findAllWos.length; i++) {
        let findEid = oldId.find(item => item.eid == findAllWos[i]['eid'])
        if (findEid) {
            //log('Есть в экселе!')
        } else {
            newEids.push({ 
                eid: findAllWos[i]['eid'] 
            })

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
                Макрос: maxCompare/100,
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

    //log(newEids)

    /* let uniqueEids = uniqueArr(newEids);
    
    await fs.writeFile('./data/newEids.json', JSON.stringify(uniqueEids))

    let data = await fs.readFile('./data/newEids.json', 'utf-8');
    
    console.log(JSON.parse(data)) */

    //await eids.save(JSON.parse(data))

    await exportW.save(newPapers)

    return true;
}

module.exports = main;