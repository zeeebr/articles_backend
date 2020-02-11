const parser = require('./parser');
const {Author, Done} = require('./db');
const {testMiddleName} = require('./utils');
const author = new Author();
let done = new Done();

async function main () {
    let findAllScopus = await paperS.findAll(['type', 'journal', 'topic', 'doi', 'eid', 'volume', 'issue', 'pages', 'ourAuthors', 'year'])
    
    //log(findAllScopus)

    let findAllScopusAuthor = await author.findAll(['name', 'alias', 'inst', 'cathedra'])

    //log(findAllScopusAuthor)
    
    let arrDone = []
    for(let i = 0; i < findAllScopus.length; i++) {
        let names = findAllScopus[i].ourAuthors.split(', ')
        //log(names)
        for(let k = 0; k < names.length; k++) {
            if(testMiddleName(names[k]) == true) {
                //log(names[k])
                let findName = findAllScopusAuthor.find(item => item.name == names[k])
                if(findName) {
                    arrDone.push({
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
                        Номер: 'Volume '+findAllScopus[i].volume+' Issue '+findAllScopus[i].issue,
                        Страницы: findAllScopus[i].pages,
                        Автор: findName['alias'],
                        Институт: findName['inst'],
                        Кафедра: findName['cathedra'],
                        Год: findAllScopus[i].year
                    })
                } 
            } else {
                let regexpTest = /(.*)\s(.\.)(.\.)/
                let findName = findAllScopusAuthor.find(item => item.name.replace(regexpTest, '$1 $2') == names[k])
                //log(findName)
                if(findName) {
                    arrDone.push({
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
                        Номер: 'Volume '+findAllScopus[i].volume+' Issue '+findAllScopus[i].issue,
                        Страницы: findAllScopus[i].pages,
                        Автор: findName['alias'],
                        Институт: findName['inst'],
                        Кафедра: findName['cathedra'],
                        Год: findAllScopus[i].year
                    })
                } else {
                    arrDone.push({
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
                        Номер: 'Volume '+findAllScopus[i].volume+' Issue '+findAllScopus[i].issue,
                        Страницы: findAllScopus[i].pages,
                        Автор: names[k],
                        Институт: '',
                        Кафедра: '',
                        Год: findAllScopus[i].year
                    })
                }
            }
        }
    }
    
    //log(arrDone)
    
    done.save(arrDone)
}

module.exports = main;