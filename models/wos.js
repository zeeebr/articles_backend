const Sequelize = require('sequelize');
const env = require('../env.js');

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
    host: env.DB_HOST,
    dialect: 'postgres',
    logging: false
});

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

exports.PaperW = PaperW;
exports.ExportW = ExportW;
exports.NewEidW = NewEidW;