const Sequelize = require('sequelize');
const sequelize = new Sequelize('work', 'postgres', '2653', {
    host: 'localhost',
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
            year: Sequelize.INTEGER,
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
            fields: ["eid","type","topic","doi","journal","issn","volume","issue","pages","author","affil","year","frezee"],
            updateOnDuplicate: ["type","topic","doi","journal","issn","volume","issue","pages","author","affil","year"]
        })
        return console.log('\x1b[36m%s\x1b[0m', 'Scopus CSV file is written to the database!')
    }   catch(err){
        console.log(err)
        }
    }
    async update(data) {
        try {
            await this.model.bulkCreate(data,{
                fields: ["eid","type","topic","doi","journal","issn","volume","issue","pages","author","ourAuthors","affil","year","frezee","createdAt","updatedAt"],
                updateOnDuplicate: ["type","topic","doi","journal","issn","volume","issue","pages","author","ourAuthors","affil","year","frezee","createdAt","updatedAt"]
            })
            return console.log('\x1b[36m%s\x1b[0m', 'Data updated')
        }   catch(err){
            console.log(err)
            }
    }
    async count(year) {
        let counter = await this.model.findAll({
            attributes: [[sequelize.fn('COUNT', sequelize.col('year')), 'count']],
            where: { year: year },
            raw: true,
        })
        return Number(counter[0]['count'])
    }
    async findAll(params) {
        return await this.model.findAll({
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
    async findAllInclude(params) {
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
        return console.log('\x1b[36m%s\x1b[0m', 'Scopus employees of the University are written to the database!')
    }   catch(err){
        console.log(err)
        }
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
            year: Sequelize.INTEGER,
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
        await this.model.bulkCreate(data,{
            fields: ["eid","type","topic","doi","journal","issn","volume","issue","pages","author","affil","year","frezee"],
            updateOnDuplicate: ["type","topic","doi","journal","issn","volume","issue","pages","author","affil","year"]
        })
        return console.log('\x1b[36m%s\x1b[0m', 'WoS CSV file is written to the database!')
    }   catch(err){
        console.log(err)
        }
    }
    async count(year) {
        let counter = await this.model.findAll({
            attributes: [[sequelize.fn('COUNT', sequelize.col('year')), 'count']],
            where: { year: year },
            raw: true,
        })
        return Number(counter[0]['count'])
    }
    async update(data) {
        try {
            await this.model.bulkCreate(data,{
                fields: ["eid","type","topic","doi","journal","issn","volume","issue","pages","author","ourAuthors","affil","year","frezee","createdAt","updatedAt"],
                updateOnDuplicate: ["type","topic","doi","journal","issn","volume","issue","pages","author","ourAuthors","affil","year","frezee","createdAt","updatedAt"]
            })
            return console.log('\x1b[36m%s\x1b[0m', 'Data updated')
        }   catch(err){
            console.log(err)
            }
    }
    async findAll(params) {
        return await this.model.findAll({
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
    async findAllInclude(params) {
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
            /*include: [{
                all: true
            }],*/
            //attributes: params,
            raw: true,
        })
    }
    async saveOurAuthors(data) {
        try {
        await this.model.bulkCreate(data, {
            updateOnDuplicate: ["ourAuthors"]
        })
        return console.log('\x1b[36m%s\x1b[0m', 'WoS employees of the University are written to the database!')
    }    catch(err){
        console.log(err)
        }
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
        await this.model.bulkCreate(data,{
            fields: ["alias","inst","cathedra","frezee"],
            updateOnDuplicate: ["inst","cathedra"]
        })
        console.log('\x1b[36m%s\x1b[0m', 'Authors CSV file is written to the database!')
        return 
    }   catch(err){
        console.log(err.message)
        }
    }
    async saveNames(data) {
        try {
        await this.model.bulkCreate(data, {
            fields: ["name","alias"],
            updateOnDuplicate: ["name"]
        })
        console.log('\x1b[36m%s\x1b[0m', 'Authors are translated into English and recorded in the database!')
        return 
    }   catch(err){
        console.log(err)
        }
    }
    async saveShortNames(data) {
        try {
        await this.model.bulkCreate(data, {
            fields: ["shortName","alias"],
            updateOnDuplicate: ["shortName"]
        })
        console.log('\x1b[36m%s\x1b[0m', 'Authors short names are recorded in the database!')
        return 
    }   catch(err){
        console.log(err)
        }
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
        },
        {
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
        await this.model.bulkCreate(data,{
            fields: ["paperId","authorId"],
            updateOnDuplicate: ["paperId","authorId"]
        })
        return console.log('\x1b[36m%s\x1b[0m', 'Article connections are written to the database!')
    }   catch(err){
        console.log(err.message)
        //fs.writeFile('err.txt', JSON.stringify(err))
        }
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
class Done {
    constructor() {
        this.model = sequelize.define('Done', {
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
            Год: Sequelize.INTEGER,
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
        return await this.model.bulkCreate(data,{
            fields: ["Индекс","Тип", "ИФ", "Квартиль", "Издание", "Статья", "DOI", "Идентификатор", "Номер", "Страницы", "Автор", "Институт", "Кафедра", "Год"],
            updateOnDuplicate: ["Индекс","Тип", "ИФ", "Квартиль", "Издание", "Статья", "DOI", "Идентификатор", "Номер", "Страницы", "Автор", "Институт", "Кафедра", "Год"]
        })
    }   catch(err){
        console.log(err.message)
        //fs.writeFileSync("err.txt", err)
        //console.log(err.sql)
        //[ 'name', 'parent', 'original', 'sql', 'parameters' ]
        }
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
                unique: true
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
        return await this.model.bulkCreate(data,{
            fields: ["eid"],
            updateOnDuplicate: ["eid"]
        })
    }   catch(err){
        console.log(err)
        //console.log(err.message)
        fs.writeFileSync("err.txt", err)
        //console.log(err.sql)
        //[ 'name', 'parent', 'original', 'sql', 'parameters' ]
        }
    }
    async findAll(params) {
        return await this.model.findAll({
            attributes: params,
            raw: true
        })
    }
}

exports.PaperS = PaperS;
exports.PaperW = PaperW;
exports.Author = Author;
exports.Connection = Connection;
exports.Done = Done;
exports.Eids = Eids;