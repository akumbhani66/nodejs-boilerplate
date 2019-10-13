const Sequelize = require('sequelize')
const UserModel = require('./models/user')

const sequelize = new Sequelize('cronMonitor', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

const User = UserModel(sequelize, Sequelize)

// Blog.belongsToMany(Tag, { through: BlogTag, unique: false })
// Tag.belongsToMany(Blog, { through: BlogTag, unique: false })
// Blog.belongsTo(User);

sequelize.sync({ force: true })
    .then(() => {
        console.log(`Database & tables created!`)
    })

module.exports = {
    User
}