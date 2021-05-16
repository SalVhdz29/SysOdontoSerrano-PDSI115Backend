'use strict'

const app=require("./app");
const config = require("./config");

const {sequelize} = require('./models/index.js');



app.listen(config.port, async()=>{
    console.log(`API FUNCIONANDO EN LOCALHOST PUERTO ${config.port}`);
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
})