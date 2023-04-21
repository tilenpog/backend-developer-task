const Sequelize = require('sequelize');

const sequelizeConfig = () => {
    const config = {
      dialect: "sqlite",
      storage: "./database.sqlite3",
      logging: true,
    };
  
    return config;
  };

  sequelize = new Sequelize(sequelizeConfig());
  
  module.exports = { sequelize };