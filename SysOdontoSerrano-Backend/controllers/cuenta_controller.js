'use strict'
// importamos mediante require modelos y librerias necesarias.

//Conexión a BD.
const {sequelize} = require('../models/index.js');
//importamos modelo para usuarios.
let init_models= require("../models/init-models");

var Entity= init_models(sequelize); // inicialización de los modelos.
const { DateTime } = require("luxon");

//Servicios
const auth_service = require("../services/auth_service");
const tbl_n_servicio = require('../models/tbl_n_servicio.js');

const obtener_cuentas_pacientes = async(req, res) =>{
    try{

        let saldos = await Entity.tbl_n_saldo.findAll();

        let lista_cuentas =[];

        for(let iterador_saldo of saldos)
        {
            if(iterador_saldo != null)
            {
                let{
                    ID_F_EXPEDIENTE,
                    SALDO
                } = iterador_saldo;

                let expediente_correspondiente = await Entity.tbl_n_expediente.findByPk(ID_F_EXPEDIENTE);

                let{ID_PACIENTE} = expediente_correspondiente;

                let paciente_correspondiente = await Entity.tbl_n_paciente.findByPk(ID_PACIENTE);

                let{
                    ID_PERSONA
                } = paciente_correspondiente;

                let persona_correspondiente = await Entity.tbl_n_persona.findByPk(ID_PERSONA);

                let detalle_paciente_correspondiente = await Entity.tbl_n_detalle_persona.findAll({
                    where:{
                        ID_PERSONA: ID_PERSONA
                    }
                });

                let sesiones_paciente = await Entity.tbl_n_sesion.findAll({
                    where:{
                        ID_EXPEDIENTE: ID_F_EXPEDIENTE,
                        ID_F_ESTADO_SESION: 2 // FINALIZADA.
                    }
                });

                let fecha_ultima_sesion ="Sin Registro";

                if(sesiones_paciente != null && sesiones_paciente.length>0)
                {
                    let numero_sesiones = sesiones_paciente.length -1;

                    let ultima_sesion = sesiones_paciente[numero_sesiones];

                    fecha_ultima_sesion = ultima_sesion.FECHA_SESION;
                }


                let nombre_paciente = persona_correspondiente.NOMBRE_PERSONA + " " +persona_correspondiente.APELLIDO_PERSONA;

                let documento_identidad =detalle_paciente_correspondiente[0].DUI;

                let numero_de_contacto = detalle_paciente_correspondiente[0].NUMERO_DE_CONTACTO;

                let estado_cuenta ="Saldado";

                if(SALDO != 0)
                {
                    if(SALDO<0)
                    {
                        estado_cuenta ="Saldo A Favor";
                    }
                    else{
                        estado_cuenta ="Debe";
                    }
                }

                let n_cuenta={
                    id_expediente: ID_F_EXPEDIENTE,
                    nombre_paciente,
                    documento_identidad,
                    numero_de_contacto,
                    estado_cuenta,
                    saldo: SALDO,
                    fecha_ultima_sesion,

                }

                lista_cuentas.push(n_cuenta);

            }
            
        }
        res.status(200).send(lista_cuentas);
    }catch(e)
    {
        console.log("ERROR====>: ", e);
        res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."});
    }
}

const historial_cuenta = async(req, res)=>{
    try{

        let {id_expediente} = req.body;

        let historial =[];


        let expediente_correspondiente = await Entity.tbl_n_expediente.findByPk(id_expediente);

        let sesiones_paciente = await Entity.tbl_n_sesion.findAll({
            where:{
                ID_EXPEDIENTE: id_expediente,
                ID_F_ESTADO_SESION: 2 // FINALIZADA.
            }
        });

        for(let iterador of sesiones_paciente)
        {
            if(iterador != null)
            {   
                let{
                    ID_SESION,
                    ID_SERVICIO,
                    FECHA_SESION
                } = iterador;

                let pago_sesion = await Entity.tb_n_pago_sesion.findAll({
                    where:{
                        ID_F_SESION: ID_SESION
                    }
                });

                pago_sesion=pago_sesion[0];

                let{
                    CANTIDAD_PAGADA,
                    TOTAL_FACTURA
                } = pago_sesion;

                let servicio = await Entity.tbl_n_servicio.findByPk(ID_SERVICIO);

                let n_pago={
                 id_sesion: ID_SESION,
                 nombre_servicio: servicio.NOMBRE_SERVICIO,
                 fecha_sesion: FECHA_SESION,
                 cantidad_pagada: CANTIDAD_PAGADA,
                 total_factura: TOTAL_FACTURA
                }

                historial.push(n_pago);



            }//fin if
        }//fin for


        res.status(200).send(historial);


    }catch(e)
    {
        console.log("ERROR===>",e)
        res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."});
    }
}
module.exports={
    obtener_cuentas_pacientes,
    historial_cuenta
}