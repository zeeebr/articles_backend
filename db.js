const Sequelize = require('sequelize');
const env = require('./env.js');
const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
    host: env.DB_HOST,
    dialect: 'postgres',
    logging: false
});
const fs = require('fs').promises;

class PaperS {
    constructor() {
        this.model = sequelize.define('PaperS', {
            eid: {
                type: Sequelize.STRING,
                primaryKey: true,
                unique: true
            },
            topic: Sequelize.STRING(4096),
            type: Sequelize.STRING,
            doi: Sequelize.STRING,
            journal: Sequelize.STRING(1024),
            issn: Sequelize.STRING,
            volume: Sequelize.STRING,
            issue: Sequelize.STRING,
            pages: Sequelize.STRING,
            author: Sequelize.STRING(10240),
            ourAuthors: Sequelize.STRING(1024),
            affil: Sequelize.STRING(51200),
            year: Sequelize.STRING,
            frezee: Sequelize.BOOLEAN
        }, {
            freezeTableName: true
        })
        this.model.removeAttribute('id');
    }
    sync() {
        return this.model.sync({
            force: true
        })
    }
    async save(data) {
        try {
            await this.model.bulkCreate(data, {
                fields: ["eid", "type", "topic", "doi", "journal", "issn", "volume", "issue", "pages", "author", "affil", "year", "frezee"],
                updateOnDuplicate: ["type", "topic", "doi", "journal", "issn", "volume", "issue", "pages", "author", "affil", "year"]
            })
            console.log('\x1b[36m%s\x1b[0m', 'Scopus CSV file is written to the database!')

        } catch (err) {
            console.log(err.message)
        }
        return true;
    }
    async update(data) {
        try {
            await this.model.bulkCreate(data, {
                fields: ["eid", "type", "topic", "doi", "journal", "issn", "volume", "issue", "pages", "author", "ourAuthors", "affil", "year", "frezee", "createdAt", "updatedAt"],
                updateOnDuplicate: ["type", "topic", "doi", "journal", "issn", "volume", "issue", "pages", "author", "ourAuthors", "affil", "year", "frezee", "createdAt", "updatedAt"]
            })
            console.log('\x1b[36m%s\x1b[0m', 'Data updated')
        } catch (err) {
            console.log(err)
        }
        return true;
    }
    async delete(id) {
        try {
            await this.model.destroy({
                where: {
                    eid: id
                }
            })
            console.log('\x1b[36m%s\x1b[0m', `Paper ${id} deleted!`)
        } catch (err) {
            console.log(err)
        }
        return true;
    }
    async count(year) {
        let counter = await this.model.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('year')), 'count']
            ],
            where: {
                year: year
            },
            raw: true,
        });
        return Number(counter[0]['count'])
    }
    async findAll(params, include) {
        return await this.model.findAll({
            include: include,
            attributes: params,
            raw: true,
        })
    }
    async findAllFalse(params) {
        return await this.model.findAll({
            where: {
                frezee: false
            },
            attributes: params,
            raw: true,
        })
    }
    async findAllIncludeId(params) {
        return await this.model.findAll({
            include: [{
                all: true
            }],
            where: {
                eid: params
            },
            raw: true,
        })
    }
    async findSome(params) {
        return await this.model.findAll({
            where: {
                eid: params
            },
            raw: true,
        })
    }
    async saveOurAuthors(data) {
        try {
            await this.model.bulkCreate(data, {
                updateOnDuplicate: ["ourAuthors"]
            })
            console.log('\x1b[36m%s\x1b[0m', 'Scopus employees of the University are written to the database!')
        } catch (err) {
            console.log(err)
        }
        return true;
    }
}
class PaperW {
    constructor() {
        this.model = sequelize.define('PaperW', {
            eid: {
                type: Sequelize.STRING,
                primaryKey: true,
                unique: true
            },
            topic: Sequelize.STRING(4096),
            type: Sequelize.STRING,
            doi: Sequelize.STRING,
            journal: Sequelize.STRING(1024),
            issn: Sequelize.STRING,
            volume: Sequelize.STRING,
            issue: Sequelize.STRING,
            pages: Sequelize.STRING,
            author: Sequelize.STRING(10240),
            ourAuthors: Sequelize.STRING(1024),
            affil: Sequelize.STRING(51200),
            year: Sequelize.STRING,
            frezee: Sequelize.BOOLEAN
        }, {
            freezeTableName: true
        })
        this.model.removeAttribute('id');
    }
    sync() {
        return this.model.sync({
            force: true
        })
    }
    async save(data) {
        try {
            await this.model.bulkCreate(data, {
                fields: ["eid", "type", "topic", "doi", "journal", "issn", "volume", "issue", "pages", "author", "affil", "year", "frezee"],
                updateOnDuplicate: ["type", "topic", "doi", "journal", "issn", "volume", "issue", "pages", "author", "affil"]
            })
            console.log('\x1b[36m%s\x1b[0m', 'WoS CSV file is written to the database!')
        } catch (err) {
            console.log(err.message)
        }
        return true;
    }
    async count(year) {
        let counter = await this.model.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('eid')), 'count']
            ],
            where: {
                year: year
            },
            raw: true,
        })
        return Number(counter[0]['count'])
    }
    async update(data) {
        try {
            await this.model.bulkCreate(data, {
                fields: ["eid", "type", "topic", "doi", "journal", "issn", "volume", "issue", "pages", "author", "ourAuthors", "affil", "year", "frezee", "createdAt", "updatedAt"],
                updateOnDuplicate: ["type", "topic", "doi", "journal", "issn", "volume", "issue", "pages", "author", "ourAuthors", "affil", "year", "frezee", "createdAt", "updatedAt"]
            })
            console.log('\x1b[36m%s\x1b[0m', 'Data updated')
        } catch (err) {
            console.log(err)
        }
        return true;
    }
    async delete(id) {
        try {
            await this.model.destroy({
                where: {
                    eid: id
                }
            })
            console.log('\x1b[36m%s\x1b[0m', `Paper ${id} deleted!`)
        } catch (err) {
            console.log(err)
        }
        return true;
    }
    async findAll(params, include) {
        return await this.model.findAll({
            include: include,
            attributes: params,
            raw: true,
        })
    }
    async findAllFalse(params) {
        return await this.model.findAll({
            where: {
                frezee: false
            },
            attributes: params,
            raw: true,
        })
    }
    async findAllWithTrue(params) {
        return await this.model.findAll({
            attributes: params,
            raw: true,
        })
    }
    async findAllIncludeId(params) {
        return await this.model.findAll({
            include: [{
                all: true
            }],
            where: {
                eid: params
            },
            raw: true
        })
    }
    async findSome(params) {
        return await this.model.findAll({
            where: {
                eid: params
            },
            raw: true,
        })
    }
    async saveOurAuthors(data) {
        try {
            await this.model.bulkCreate(data, {
                updateOnDuplicate: ["ourAuthors"]
            })
            console.log('\x1b[36m%s\x1b[0m', 'WoS employees of the University are written to the database!')
        } catch (err) {
            console.log(err)
        }
        return true;
    }
}
class Author {
    constructor() {
        this.model = sequelize.define('Author', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                //unique: true
            },
            shortName: Sequelize.STRING,
            name: Sequelize.STRING,
            alias: {
                type: Sequelize.STRING,
                unique: true
            },
            inst: Sequelize.STRING,
            cathedra: Sequelize.STRING,
            frezee: Sequelize.BOOLEAN
        }, {
            freezeTableName: true
        })
    }
    sync() {
        return this.model.sync({
            force: true
        })
    }
    async save(data) {
        try {
            await this.model.bulkCreate(data, {
                fields: ["alias", "inst", "cathedra", "frezee"],
                updateOnDuplicate: ["inst", "cathedra"]
            })
            console.log('\x1b[36m%s\x1b[0m', 'Authors CSV file is written to the database!')
        } catch (err) {
            console.log(err.message)
        }
        return true;
    }
    async saveNames(data) {
        try {
            await this.model.bulkCreate(data, {
                fields: ["name", "alias"],
                updateOnDuplicate: ["name"]
            })
            console.log('\x1b[36m%s\x1b[0m', 'Authors are translated into English and recorded in the database!')
        } catch (err) {
            console.log(err)
        }
        return true;
    }
    async saveShortNames(data) {
        try {
            await this.model.bulkCreate(data, {
                fields: ["shortName", "alias"],
                updateOnDuplicate: ["shortName"]
            })
            console.log('\x1b[36m%s\x1b[0m', 'Authors short names are recorded in the database!')
        } catch (err) {
            console.log(err)
        }
        return true;
    }
    async findAll(params) {
        return await this.model.findAll({
            attributes: params,
            raw: true,
        })
    }
    async findAllFrezeeFalse(params) {
        return await this.model.findAll({
            where: {
                frezee: false
            },
            attributes: params,
            raw: true,
        })
    }
    async findAllInclude(params) {
        return await this.model.findAll({
            include: [{
                all: true
            }],
            raw: true,
        })
    }
}
class Connection {
    constructor() {
        this.model = sequelize.define('Connection', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true
            },
            paperId: {
                type: Sequelize.STRING,
                foreignKey: true,
                unique: true,
                //unique: 'uniqueTag', // Turn on when starting updTable.js, and turn off the line above
            },
            authorId: {
                type: Sequelize.BIGINT,
                foreignKey: true,
                unique: true,
                //unique: 'uniqueTag', // Turn on when starting updTable.js, and turn off the line above
            },
        }, {
            freezeTableName: true
        })
    }
    sync() {
        return this.model.sync({
            force: true
        })
    }
    async save(data) {
        try {
            await this.model.bulkCreate(data, {
                fields: ["paperId", "authorId"],
                updateOnDuplicate: ["paperId", "authorId"]
            })
            console.log('\x1b[36m%s\x1b[0m', 'Article connections are written to the database!')
        } catch (err) {
            console.log(err.message)
            //fs.writeFile('err.txt', JSON.stringify(err))
        }
        return true;
    }
    async findAll(params) {
        return await this.model.findAll({
            attributes: params,
            raw: true,
            include: [{
                all: true
            }],
        })
    }
    async findAllInclude(params) {
        return await this.model.findAll({
            include: [{
                all: true
            }],
            where: {
                paperId: params
            },
            raw: true,
        })
    }
}
class ExportS {
    constructor() {
        this.model = sequelize.define('ExportS', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true
            },
            Индекс: Sequelize.STRING,
            Тип: Sequelize.STRING,
            ИФ: Sequelize.STRING,
            Квартиль: Sequelize.STRING,
            Издание: Sequelize.STRING(1024),
            Проверка: Sequelize.STRING,
            Статья: Sequelize.STRING(1024),
            DOI: Sequelize.STRING,
            Идентификатор: Sequelize.STRING,
            ID: Sequelize.STRING,
            Name: Sequelize.STRING,
            Макрос: Sequelize.STRING,
            Дубляж: Sequelize.STRING,
            Номер: Sequelize.STRING,
            Страницы: Sequelize.STRING,
            Автор: Sequelize.STRING,
            Институт: Sequelize.STRING,
            Кафедра: Sequelize.STRING,
            Год: Sequelize.STRING,
        }, {
            freezeTableName: true,
        })
    }
    sync() {
        return this.model.sync({
            force: true
        })
    }
    async save(data) {
        try {
            await this.model.truncate();
            await this.model.bulkCreate(data, {
                fields: ["Индекс", "Тип", "ИФ", "Квартиль", "Издание", "Проверка", "Статья", "DOI", "Идентификатор", "ID", "Name",  "Макрос", "Дубляж", "Номер", "Страницы", "Автор", "Институт", "Кафедра", "Год"],
                updateOnDuplicate: ["Индекс", "Тип", "ИФ", "Квартиль", "Издание", "Статья", "DOI", "Идентификатор", "Макрос", "Дубляж", "Номер", "Страницы", "Автор", "Институт", "Кафедра", "Год"]
            })
            console.log('\x1b[36m%s\x1b[0m', 'Export new papers complete!')
        } catch (err) {
            console.log(err.message)
            //fs.writeFileSync("err.txt", err)
            //console.log(err.sql)
            //[ 'name', 'parent', 'original', 'sql', 'parameters' ]
        }
        return true;
    }
    async findAll() {
        return await this.model.findAll({
            attributes: ["Индекс", "Тип", "ИФ", "Квартиль", "Издание", "Проверка", "Статья", "DOI", "Идентификатор", "ID", "Name",  "Макрос", "Дубляж", "Номер", "Страницы", "Автор", "Институт", "Кафедра", "Год"],
            raw: true
        })
    }
    async truncate() {
        try {
            await this.model.truncate();
            console.log('\x1b[36m%s\x1b[0m', 'Truncated export DB!')
        } catch (err) {
            console.log(err.message)
        }
        return true;
    }
}
class ExportW {
    constructor() {
        this.model = sequelize.define('ExportW', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true
            },
            Индекс: Sequelize.STRING,
            Тип: Sequelize.STRING,
            ИФ: Sequelize.STRING,
            Квартиль: Sequelize.STRING,
            Издание: Sequelize.STRING(1024),
            Проверка: Sequelize.STRING,
            Статья: Sequelize.STRING(1024),
            DOI: Sequelize.STRING,
            Идентификатор: Sequelize.STRING,
            ID: Sequelize.STRING,
            Name: Sequelize.STRING,
            Макрос: Sequelize.STRING,
            Дубляж: Sequelize.STRING,
            Номер: Sequelize.STRING,
            Страницы: Sequelize.STRING,
            Автор: Sequelize.STRING,
            Институт: Sequelize.STRING,
            Кафедра: Sequelize.STRING,
            Год: Sequelize.STRING,
        }, {
            freezeTableName: true,
        })
    }
    sync() {
        return this.model.sync({
            force: true
        })
    }
    async save(data) {
        try {
            await this.model.truncate();
            await this.model.bulkCreate(data, {
                fields: ["Индекс", "Тип", "ИФ", "Квартиль", "Издание", "Статья", "DOI", "Идентификатор", "Макрос", "Дубляж", "Номер", "Страницы", "Автор", "Институт", "Кафедра", "Год"],
                updateOnDuplicate: ["Индекс", "Тип", "ИФ", "Квартиль", "Издание", "Статья", "DOI", "Идентификатор", "Макрос", "Дубляж", "Номер", "Страницы", "Автор", "Институт", "Кафедра", "Год"]
            })
            console.log('\x1b[36m%s\x1b[0m', 'Export new papers complete!')
        } catch (err) {
            console.log(err.message)
            //fs.writeFileSync("err.txt", err)
            //console.log(err.sql)
            //[ 'name', 'parent', 'original', 'sql', 'parameters' ]
        }
        return true;
    }
    async findAll() {
        return await this.model.findAll({
            attributes: ["Индекс", "Тип", "ИФ", "Квартиль", "Издание", "Проверка", "Статья", "DOI", "Идентификатор", "ID", "Name",  "Макрос", "Дубляж", "Номер", "Страницы", "Автор", "Институт", "Кафедра", "Год"],
            raw: true
        })
    }
    async truncate() {
        try {
            await this.model.truncate();
            console.log('\x1b[36m%s\x1b[0m', 'Truncated export DB!')
        } catch (err) {
            console.log(err.message)
        }
        return true;
    }
}

class Eids {
    constructor() {
        this.model = sequelize.define('Eids', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true
            },
            eid: {
                type: Sequelize.STRING,
                unique: true,
           }
        }, {
            freezeTableName: true,
        })
    }
    sync() {
        return this.model.sync({
            force: true
        })
    }
    async save(data) {
        try {
            await this.model.bulkCreate(data, {
                fields: ["eid"],
                updateOnDuplicate: ["eid"]
            })
            console.log('\x1b[36m%s\x1b[0m', 'Data updated!')
        } catch (err) {
            //console.log(err)
            console.log(err)
            //fs.writeFileSync("err.txt", err)
            //console.log(err.sql)
            //[ 'name', 'parent', 'original', 'sql', 'parameters' ]
        }
        return true;
    }
    async findAll(params) {
        return await this.model.findAll({
            attributes: params,
            raw: true
        })
    }
}

class NewEidS {
    constructor() {
        this.model = sequelize.define('NewEidS', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true
            },
            eid: {
                type: Sequelize.STRING,
                unique: true,
            },
            year: Sequelize.STRING
        }, {
            freezeTableName: true,
        })
    }
    sync() {
        return this.model.sync({
            force: true
        })
    }
    async save(data) {
        try {
            await this.model.truncate();
            await this.model.bulkCreate(data, {
                fields: ["eid", "year"],
                updateOnDuplicate: ["eid", "year"]
            })
            console.log('\x1b[36m%s\x1b[0m', 'New eids recorded!')
        } catch (err) {
            console.log(err.message)
        }
        return true;
    }
    async findAll(params) {
        return await this.model.findAll({
            attributes: params,
            raw: true
        })
    }
    async count(year) {
        let counter = await this.model.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('eid')), 'count']
            ],
            where: {
                year: year
            },
            raw: true,
        })
        return Number(counter[0]['count'])
    }
    async truncate() {
        try {
            await this.model.truncate();
            console.log('\x1b[36m%s\x1b[0m', 'Truncated eids DB!')
        } catch (err) {
            console.log(err.message)
        }
        return true;
    }
}

class NewEidW {
    constructor() {
        this.model = sequelize.define('NewEidW', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true
            },
            eid: {
                type: Sequelize.STRING,
                unique: true,
            },
            year: Sequelize.STRING
        }, {
            freezeTableName: true,
        })
    }
    sync() {
        return this.model.sync({
            force: true
        })
    }
    async save(data) {
        try {
            await this.model.truncate();
            await this.model.bulkCreate(data, {
                fields: ["eid", "year"],
                updateOnDuplicate: ["eid", "year"]
            })
            console.log('\x1b[36m%s\x1b[0m', 'New eids recorded!')
        } catch (err) {
            console.log(err.message)
        }
        return true;
    }
    async findAll(params) {
        return await this.model.findAll({
            attributes: params,
            raw: true
        })
    }
    async count(year) {
        let counter = await this.model.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('eid')), 'count']
            ],
            where: {
                year: year
            },
            raw: true,
        })
        return Number(counter[0]['count'])
    }
    async truncate() {
        try {
            await this.model.truncate();
            console.log('\x1b[36m%s\x1b[0m', 'Truncated eids DB!')
        } catch (err) {
            console.log(err.message)
        }
        return true;
    }
}

exports.PaperS = PaperS;
exports.PaperW = PaperW;
exports.Author = Author;
exports.Connection = Connection;
exports.ExportS = ExportS;
exports.ExportW = ExportW;
exports.Eids = Eids;
exports.NewEidS = NewEidS;
exports.NewEidW = NewEidW;