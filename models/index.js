const Sequelize = require('sequelize');
const env = require('../env.js');

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
    host: env.DB_HOST,
    dialect: 'postgres',
    logging: false
});


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
        return this.model.sync()
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
        return this.model.sync()
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
        return this.model.sync()
    }
    async save(data) {
        try {
            await this.model.bulkCreate(data, {
                fields: ["eid"],
                updateOnDuplicate: ["eid"]
            })
            console.log('\x1b[36m%s\x1b[0m', 'Data updated!')
        } catch (err) {
            console.log(err)
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

exports.Author = Author;
exports.Connection = Connection;
exports.Eids = Eids;