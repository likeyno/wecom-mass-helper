const { Sequelize } = require('sequelize');
const { db } = require('./env');

const sequelize = new Sequelize(db.name, db.user, db.password, {
  host: db.host,
  port: db.port,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
    paranoid: true,
    charset: 'utf8mb4',
  },
});

module.exports = sequelize;
