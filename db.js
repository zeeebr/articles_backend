const Sequelize = require('sequelize');
const sequelize = new Sequelize('test', 'postgres', '2653', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
});

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
            volume: Sequelize.STRING,
            issue: Sequelize.STRING,
            pages: Sequelize.STRING,
            author: Sequelize.STRING(10240),
            ourAuthors: Sequelize.STRING(1024),
            affil: Sequelize.STRING(51200),
            year: Sequelize.STRING
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
        return await this.model.bulkCreate(data, {
            fields: ["eid","type","topic","doi","journal","volume","issue","pages","author","affil","year"],
            updateOnDuplicate: ["type","topic","doi","journal","volume","issue","pages","author","affil","year"]
        })
    }    catch(err){
        console.log(err)
        }
    }
    async findAll(params) {
        return await this.model.findAll({
            include: [{
                all: true
            }],
        //    attributes: params,
            raw: true,
        })
    }
    async saveOurAuthors(data) {
        try {
        return await this.model.bulkCreate(data, {
            updateOnDuplicate: ["ourAuthors"]
        })
    }    catch(err){
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
            volume: Sequelize.STRING,
            issue: Sequelize.STRING,
            pages: Sequelize.STRING,
            author: Sequelize.STRING(10240),
            ourAuthors: Sequelize.STRING(1024),
            affil: Sequelize.STRING(51200),
            year: Sequelize.STRING
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
        return await this.model.bulkCreate(data,{
            fields: ["eid","type","topic","doi","journal","volume","issue","pages","author","affil","year"],
            updateOnDuplicate: ["type","topic","doi","journal","volume","issue","pages","author","affil","year"]
        })
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
    async saveOurAuthors(data) {
        try {
        return await this.model.bulkCreate(data, {
            updateOnDuplicate: ["ourAuthors"]
        })
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
                unique: true
            },
            name: Sequelize.STRING,
            alias: Sequelize.STRING,
            inst: Sequelize.STRING,
            cathedra: Sequelize.STRING
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
        return await this.model.bulkCreate(data,{
            fields: ["name","alias","inst","cathedra"],
            updateOnDuplicate: ["name","inst","cathedra"]
        })
    }   catch(err){
        console.log(err)
        }
    }
    async findAll(params) {
        return await this.model.findAll({
                include: [{
                    all: true
                }],
          //  attributes: params,
            raw: true,
        })
    }
    async saveNames(data) {
        try {
        return await this.model.bulkCreate(data, {
            updateOnDuplicate: ["name"]
        })
    }    catch(err){
        console.log(err)
        }
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
                unique: true
            },
            authorId: {
                type: Sequelize.BIGINT,
                foreignKey: true,
                unique: true
            },
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
            fields: ["paperId","authorId"],
            updateOnDuplicate: ["paperId","authorId"]
        })
    }   catch(err){
        console.log(err)
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

exports.PaperS = PaperS;
exports.PaperW = PaperW;
exports.Author = Author;
exports.Connection = Connection;