const { sequelize } = require('../models');

async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');

    await sequelize.sync({ force: false, alter: true });
    console.log('数据库表同步完成');

    process.exit(0);
  } catch (error) {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  }
}

initDatabase();
