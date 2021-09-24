'use strict' 
//Conexión a BD.
const {sequelize} = require('../models/index.js');
let init_models= require("../models/init-models")
var Entity= init_models(sequelize); // inicialización de los modelos.
const { DateTime } = require("luxon");
const citas_en_fecha = async(fecha_a_buscar) =>{
    try{
       let citas_fecha = []

       citas_fecha = await Entity.tbl_n_sesion.findAll({
           where:{
               ID_F_ESTADO_SESION: 1,
           }
       });

       let citas =[]
       console.log("ordinal it: ",fecha_a_buscar.ordinal);
      for(let iterador of citas_fecha)
      {
          if(iterador != null)
          {
              let{FECHA_SESION} = iterador;

              FECHA_SESION = DateTime.fromJSDate(FECHA_SESION);
  
              console.log("ordinal: ", FECHA_SESION.ordinal);

              if(FECHA_SESION.ordinal == fecha_a_buscar.ordinal)
              {
                  citas.push(iterador)
              }
          }
      }
    
        return citas;
        }
        catch(e)
        {
            return e;
        }

}
module.exports={
    citas_en_fecha,
}