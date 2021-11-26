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

const resumenCitasPorMes = async(req, res)=>{
    try{

        let fecha_hoy = new Date();

        console.log("FECHA: ", fecha_hoy.getMonth())

        let mes_actual = fecha_hoy.getMonth();

        let citas = await Entity.tbl_n_sesion.findAll({
            where:{
                ID_F_ESTADO_SESION: 2
            }
        });

        let lista_citas_mes=[];

        let total_costo=0, total_deducible=0, total_pagado=0, total_margen=0;

        for(let iterador_cita of citas){
            if(iterador_cita != null){

                let{
                    ID_SESION,
                    FECHA_SESION,
                    ID_EXPEDIENTE,
                    ID_SERVICIO
                } = iterador_cita;

                let fecha_sesion_js = new Date(FECHA_SESION);

                let month = fecha_sesion_js.getMonth();

                if(month == mes_actual)
                {
                    let expediente_correspondiente = await Entity.tbl_n_expediente.findAll({
                        where:{
                            ID_EXPEDIENTE: ID_EXPEDIENTE
                        }
                    });

                    expediente_correspondiente = expediente_correspondiente[0];

                    let {
                        ID_PACIENTE
                    } = expediente_correspondiente;

                    let paciente_correspondiente = await Entity.tbl_n_paciente.findByPk(ID_PACIENTE);

                    let {
                        ID_PERSONA
                    } = paciente_correspondiente;

                    let persona_correspondiente = await Entity.tbl_n_persona.findByPk(ID_PERSONA);

                    let{
                        NOMBRE_PERSONA,
                        APELLIDO_PERSONA
                    } = persona_correspondiente;

                    let nombre_paciente = NOMBRE_PERSONA +" "+APELLIDO_PERSONA;


                    let pago_sesion = await Entity.tb_n_pago_sesion.findAll({
                        where:{
                            ID_F_SESION: ID_SESION
                        }
                    });
                    console.log("pago_sesion: ",pago_sesion)
                    pago_sesion = pago_sesion[0];

                    console.log("antes TRANSACCIONES: ");
                    console.log("pago_sesion: ",pago_sesion)

                    let transacciones_insumo = await Entity.tbl_n_transaccion_insumo.findAll({
                        where:{
                            ID_F_PAGO_SESION: pago_sesion.ID_PAGO_SESION
                        }
                    });

                    console.log("luego TRANSACCIONES")

                    let{
                        TOTAL_FACTURA,
                        CANTIDAD_PAGADA,
                        PAGO_CON_DEUDA
                    } = pago_sesion;

                    let deducible = 0;

                    let costo = 0;

                    //iterando transacciones insumo.

                    let costo_insumos= 0;

                    let precio_insumos=0;

                    console.log("antes FOR");

                    for(let iterador_transaccion of transacciones_insumo){
                        if(iterador_transaccion != null){

                            let{
                                ID_LOTE,
                                CANTIDAD_INSUMO
                            } = iterador_transaccion

                            let lote_correspondiente = await Entity.tbl_n_lote.findByPk(ID_LOTE);

                            let{
                                COSTO_LOTE,
                                PRECIO_EFECTIVO,
                                CANTIDAD_LOTE
                            } = lote_correspondiente;

                            let costo_unitario = parseFloat(COSTO_LOTE) / parseInt(CANTIDAD_LOTE);

                            let precio_unitario = parseFloat(PRECIO_EFECTIVO) / parseInt(CANTIDAD_LOTE);

                            let costo_insumo = parseFloat(costo_unitario) * parseInt(CANTIDAD_INSUMO);

                            let precio_insumo =parseFloat( precio_unitario * CANTIDAD_INSUMO);

                            costo_insumo = parseFloat(parseFloat(costo_insumo).toFixed(2));

                            costo_insumos+=costo_insumo;

                            precio_insumo = parseFloat(parseFloat(precio_insumo).toFixed(2));

                            precio_insumos += precio_insumo;

                        }
                    }// end for costo_insumos.

                    let servicio_sesion = await Entity.tbl_n_servicio.findByPk(ID_SERVICIO);

                    let{
                        NOMBRE_SERVICIO,
                        COSTO_SERVICIO,
                        PRECIO_SERVICIO
                    } = servicio_sesion;


                    let total_precios = parseFloat(precio_insumos) + parseFloat(PRECIO_SERVICIO);

                    costo = parseFloat(costo_insumos) + parseFloat(COSTO_SERVICIO);

                    if(total_precios < TOTAL_FACTURA)
                    {
                        deducible = parseFloat(total_precios) - parseFloat(TOTAL_FACTURA);
                    }

                    let margen = parseFloat(CANTIDAD_PAGADA) - parseFloat(TOTAL_FACTURA);


                    total_costo +=parseFloat(costo);
                    total_margen += parseFloat(margen);
                    total_deducible += parseFloat(deducible);
                    total_pagado += parseFloat(CANTIDAD_PAGADA);


                    let dia = fecha_sesion_js.getDate();
                    let mes = fecha_sesion_js.getMonth();
                    let anio = fecha_sesion_js.getFullYear();

                    if(dia <10)
                    {
                        dia = "0"+dia
                    }

                    if(mes <10)
                    {
                        mes = "0"+mes
                    }

                    let fecha_sesion = dia+ " - "+mes+" - "+anio;

                    let n_cita={
                        id_cita: ID_SESION,
                        fecha_sesion,
                        nombre_paciente,
                        costo,
                        deducible,
                        pago: CANTIDAD_PAGADA,
                        margen
                    }

                    lista_citas_mes.push(n_cita)

                }// if month.




            }//end if
        }//end for

        let datos={
            lista_citas_mes,
            total_costo,
            total_deducible,
            total_margen,total_pagado
        }

        res.status(200).send(datos);
    }catch(e)
    {
        console.log>("EL ERROR: ==> ",e);
        res.status(500).send({errorMessage:  "Ha ocurrido un error en el servidor."});
    }
}

module.exports={
    resumenCitasPorMes
}