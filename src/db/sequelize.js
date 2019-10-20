const Sequelize = require('sequelize')
const UserModel = require('./models/user')

require('dotenv').config()

const sequelize = new Sequelize(process.env.db, process.env.user, process.env.password, {
  host: process.env.host,
  dialect: "postgres",
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

const User = UserModel(sequelize, Sequelize)

// UserBlog.belongsTo(Blog);

sequelize.sync({ force: false })
  .then(() => {
    console.log(`Database & tables created!`)
  })

module.exports = {
  User
}