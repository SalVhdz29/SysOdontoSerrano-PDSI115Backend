'use strict' 
//Conexión a BD.
const {sequelize} = require('../models/index.js');
let init_models= require("../models/init-models")
var Entity= init_models(sequelize); // inicialización de los modelos.
const lista_servicios = async(fecha_a_buscar) =>{
    try{
       let lista_servicios = []

       lista_servicios =await Entity.tbl_n_servicio.findAll({
       });
    
        return lista_servicios;
        }
        catch(e)
        {
            return e;
        }

}
module.exports={
    lista_servicios,
}