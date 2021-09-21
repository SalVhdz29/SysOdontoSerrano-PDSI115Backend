'use strict' 
//Conexión a BD.
const {sequelize} = require('../models/index.js');
let init_models= require("../models/init-models")
var Entity= init_models(sequelize); // inicialización de los modelos.
const { DateTime } = require("luxon");

const obtener_saldo_cliente = async(id_expediente)=>{
    try{
        let saldo = parseFloat(0.00);

        let saldo_c = await Entity.tbl_n_saldo.findAll({
            where:{
                ID_F_EXPEDIENTE: id_expediente
            }
        });

        if(saldo_c != undefined && saldo_c != null)
        {
            saldo = saldo_c[0].SALDO
        }

        return saldo;
    }
    catch(e)
    {
        console.log("ERROR: ",e);
        return null;
    }
}

module.exports={
    obtener_saldo_cliente
}