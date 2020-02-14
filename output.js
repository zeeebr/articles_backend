const parser = require('./parser');
const {Author, PaperS, Connection, Done, Eids} = require('./db');
const {testMiddleName} = require('./utils');
const author = new Author();
const paperS = new PaperS();
const connection = new Connection();
const eids = new Eids();
let done = new Done();
const log = console.log;

async function main () {
    let eidsData = await parser('data/eids.csv');
    //log(eidsData)

    await eids.save(eidsData)

    paperS.model.belongsToMany(author.model, { through: connection.model, foreignKey:'paperId' })
    author.model.belongsToMany(paperS.model, { through: connection.model, foreignKey:'authorId' })
    
    let findAllScopus = await paperS.findAllInclude(['type', 'journal', 'topic', 'doi', 'eid', 'volume', 'issue', 'pages', 'ourAuthors', 'year'])
    let oldScopusId = await eids.findAll(['id', 'eid']);
    //log(findAllScopus)

    let newScopus = [];
    for(let i = 0; i < findAllScopus.length; i++) {
        let findEid = oldScopusId.find(item => item.eid == findAllScopus[i]['eid'])
        if(findEid) {
            //log('Есть!')
        } else {
            if(findAllScopus[i]['Authors.alias']) {
                newScopus.push({
                    Индекс: 'Scopus',
                    Тип: findAllScopus[i].type,
                    ИФ: '',
                    Квартиль:  '',
                    Издание: findAllScopus[i].journal,
                    Статья: findAllScopus[i].topic,
                    DOI: findAllScopus[i].doi,
                    Идентификатор: findAllScopus[i].eid.substr(7, 11),
                    ID: '',
                    Name: '',
                    Макрос: '',
                    Дубляж: '',
                    Номер: ((findAllScopus[i].volume) ? `${'Volume '+findAllScopus[i].volume+', '}` : '')+((findAllScopus[i].issue) ? `${'Issue '+findAllScopus[i].issue}` : ''),
                    //'Volume '+findAllScopus[i].volume+' Issue '+findAllScopus[i].issue,
                    Страницы: findAllScopus[i].pages,
                    Автор: findAllScopus[i]['Authors.alias'],
                    Институт: findAllScopus[i]['Authors.inst'],
                    Кафедра: findAllScopus[i]['Authors.cathedra'],
                    Год: findAllScopus[i].year
                })
            } else {
                newScopus.push({
                    Индекс: 'Scopus',
                    Тип: findAllScopus[i].type,
                    ИФ: '',
                    Квартиль:  '',
                    Издание: findAllScopus[i].journal,
                    Статья: findAllScopus[i].topic,
                    DOI: findAllScopus[i].doi,
                    Идентификатор: findAllScopus[i].eid.substr(7, 11),
                    ID: '',
                    Name: '',
                    Макрос: '',
                    Дубляж: '',
                    Номер: ((findAllScopus[i].volume) ? `${'Volume '+findAllScopus[i].volume+', '}` : '')+((findAllScopus[i].issue) ? `${'Issue '+findAllScopus[i].issue}` : ''),
                    Страницы: findAllScopus[i].pages,
                    Автор: findAllScopus[i]['ourAuthors'],
                    Институт: '',
                    Кафедра: '',
                    Год: findAllScopus[i].year
                })
            }
            
        }
    }
    //log(newScopus)
    done.save(newScopus)
}

module.exports = main;