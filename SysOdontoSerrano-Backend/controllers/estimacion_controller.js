'use strict'

//Conexión a BD.
const {sequelize} = require('../models/index.js');
//importamos modelo para usuarios.
let init_models= require("../models/init-models");

var Entity= init_models(sequelize); // inicialización de los modelos.
const { DateTime } = require("luxon");

const guardarEstimacion = async(req, res)=>{

    try{
        console.log("ENTRO A GUARDAR");

        let { id_expediente, total_estimado, servicios_estimados } = req.body;

        let expediente_correspondiente = await Entity.tbl_n_expediente.findByPk(id_expediente);

        if(expediente_correspondiente == null)
        {
            res.status(500).send({errorMessage:"No existe el expediente del paciente seleccionado"});
        }
        else
        {

            let n_cotizacion = await Entity.tbl_n_cotizacion.create({
                ID_EXPEDIENTE: expediente_correspondiente.ID_EXPEDIENTE,
                TOTAL_ESTIMADO: total_estimado
            });


            let { ID_COTIZACION } = n_cotizacion;

            for(let iterador_servicios_estimados of servicios_estimados )
            {

                if(iterador_servicios_estimados != null)
                {

                    let {id_servicio, cantidad } = iterador_servicios_estimados;

                    let n_cotizacion_servicio = await Entity.tbl_n_cotizacion_servicio.create({
                        ID_F_COTIZACION: ID_COTIZACION,
                        ID_F_SERVICIO: id_servicio,
                        CANTIDAD_REALIZACION_SERVICIO: cantidad
                    });

                }
            }

            res.status(200).send({message:"OK"});
        }
    }
    catch(e)
    {
        console.log("ERROR: ",e);
        res.status(500).send({errorMessage:"Ha ocurrido un error en el servidor"});
    }
}

module.exports={
    guardarEstimacion
}