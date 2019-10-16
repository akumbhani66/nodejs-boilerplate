const Sequelize = require('sequelize')
const UserModel = require('./models/user')

require('dotenv').config()

const sequelize = new Sequelize('cronMonitor', 'postgres', 'postgres', {
  host: "127.0.0.1",
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