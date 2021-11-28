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
                            console.log("precio_untario: ", precio_unitario)
                            console.log("CANTIDAD INSUMO", CANTIDAD_INSUMO)
                            console.log("ID_LOTE")
                            let precio_insumo =parseFloat( precio_unitario) * parseInt(CANTIDAD_INSUMO);
                            console.log("precio_insumo: ", precio_insumo)
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

                    console.log("precio_INSUMOS", precio_insumos)
                    let total_precios = parseFloat(precio_insumos) + parseFloat(PRECIO_SERVICIO);

                    costo = parseFloat(costo_insumos) + parseFloat(COSTO_SERVICIO);
                    console.log("TOTAL PRECIOS: ", total_precios)

                    if(parseFloat(total_precios) > parseFloat(TOTAL_FACTURA))
                    {
                        console.log("IFA")
                        deducible = parseFloat(total_precios) - parseFloat(TOTAL_FACTURA);
                    }

                    let margen = parseFloat(CANTIDAD_PAGADA) - parseFloat(costo);


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

                    deducible = parseFloat(deducible).toFixed(2)
                    costo = parseFloat(costo).toFixed(2)
                    margen = parseFloat(margen).toFixed(2)

                    console.log("CITA: ", ID_SESION)
                    console.log("COSTO: ", costo)
                    console.log("DEDUCIBLE: ", deducible)
                    console.log("MARGEN: ",margen)

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
        total_costo = parseFloat(total_costo).toFixed(2)
        total_deducible = parseFloat(total_deducible).toFixed(2)
        total_margen = parseFloat(total_margen).toFixed(2)
        total_pagado =parseFloat(total_pagado).toFixed(2)
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

const serviciosSolicitadosPorMes = async(req,res)=>{
    try{

        let lista_servicios=[];

        let servicios = await Entity.tbl_n_servicio.findAll();

        for(let iterador_servicio of servicios){
            if(iterador_servicio != null){

                let nombre_servicio = iterador_servicio.NOMBRE_SERVICIO;

                let costo_servicio = iterador_servicio.COSTO_SERVICIO;

                let precio_servicio = iterador_servicio.PRECIO_SERVICIO;

                let cotizaciones_servicios = await Entity.tbl_n_cotizacion_servicio.findAll({
                    where:{
                        ID_F_SERVICIO: iterador_servicio.ID_SERVICIO
                    }
                })

                cotizaciones_servicios = cotizaciones_servicios.length;

                let fecha_hoy = new Date();

                let sesiones_servicio = await Entity.tbl_n_sesion.findAll({
                    where:{
                        ID_SERVICIO: iterador_servicio.ID_SERVICIO,
                        ID_F_ESTADO_SESION: 2
                    }
                });

                let contador_citas_servicio = 0;
                let total_deducible_aplicado = 0, total_margen =0;

                for(let iterador_sesiones of sesiones_servicio){
                    if(iterador_sesiones != null){
                        let{
                            FECHA_SESION
                        } = iterador_sesiones;

                        let fecha_js = new Date(FECHA_SESION);

                        let mes_js = fecha_js.getMonth();


                        if(fecha_hoy.getMonth() == mes_js)
                        {
                            contador_citas_servicio++;

                            let pago_sesion = await Entity.tb_n_pago_sesion.findAll({
                                where:{
                                    ID_F_SESION: iterador_sesiones.ID_SESION
                                }
                            });


                            pago_sesion =pago_sesion[0];

                            let transacciones_insumo = await Entity.tbl_n_transaccion_insumo.findAll({
                                where:{
                                    ID_F_PAGO_SESION: pago_sesion.ID_PAGO_SESION
                                }
                            });
                            console.log("pase antes for");
                            let costo_insumos=0, precio_insumos = 0;
                            let costo = 0, deducible = 0;
                            console.log("pase esa madre")
                            console.log("transacciones: ", transacciones_insumo);

                            for(let iterador_transaccion of transacciones_insumo){
                                if(iterador_transaccion != null){
                                    console.log("entro")
        
                                    let{
                                        ID_LOTE,
                                        CANTIDAD_INSUMO
                                    } = iterador_transaccion
                                    console.log("antes lote")
                                    let lote_correspondiente = await Entity.tbl_n_lote.findByPk(ID_LOTE);
                                    
        
                                    let{
                                        COSTO_LOTE,
                                        PRECIO_EFECTIVO,
                                        CANTIDAD_LOTE
                                    } = lote_correspondiente;
        
                                    let costo_unitario = parseFloat(COSTO_LOTE) / parseInt(CANTIDAD_LOTE);
        
                                    let precio_unitario = parseFloat(PRECIO_EFECTIVO) / parseInt(CANTIDAD_LOTE);
        
                                    let costo_insumo = parseFloat(costo_unitario) * parseInt(CANTIDAD_INSUMO);
        
                                    let precio_insumo =parseFloat( precio_unitario) * parseInt(CANTIDAD_INSUMO);
        
                                    costo_insumo = parseFloat(parseFloat(costo_insumo).toFixed(2));
        
                                    costo_insumos+=costo_insumo;
        
                                    precio_insumo = parseFloat(parseFloat(precio_insumo).toFixed(2));
        
                                    precio_insumos += precio_insumo;
        
                                }
                            }// end for costo_insumos.
                            console.log("antes de total_precios: ");
                            let total_precios = parseFloat(precio_insumos) + parseFloat(iterador_servicio.PRECIO_SERVICIO);

                            costo = parseFloat(costo_insumos) + parseFloat(iterador_servicio.COSTO_SERVICIO);
                            console.log("antes del if: ",total_precios);

                            if(parseFloat(total_precios) > parseFloat(pago_sesion.TOTAL_FACTURA))
                            {
                                deducible = parseFloat(total_precios) - parseFloat(pago_sesion.TOTAL_FACTURA);
                            }
                            console.log("ITERADOR SSSS: ", iterador_sesiones.ID_SESION)
                            let margen = parseFloat(pago_sesion.CANTIDAD_PAGADA) - parseFloat(costo);

                            console.log("DEDUCIBLE: ", deducible)
                            console.log("MARGEN: ", margen)
                            total_margen +=parseFloat(margen)

                            total_deducible_aplicado += parseFloat(deducible);

                        



                        }// if month
                    }
                }
                if(costo_servicio == null)
                {
                    costo_servicio = 0.00;
                }

                total_deducible_aplicado = parseFloat(total_deducible_aplicado).toFixed(2)
                total_margen = parseFloat(total_margen).toFixed(2)
                
                let n_servicio={
                    servicio: nombre_servicio,
                    costo_servicio, 
                    precio_servicio,
                    citas_realizado: contador_citas_servicio,
                    total_deducible_aplicado,
                    total_margen
                }

                lista_servicios.push(n_servicio);


            }


        }

        res.status(200).send(lista_servicios);

    }catch(e)
    {
        console.log>("EL ERROR: ==> ",e);
        res.status(500).send({errorMessage:  "Ha ocurrido un error en el servidor."});
    }
}

const inventariosInsumoTotalidad=async(req,res)=>{
    try{

        let lista_insumos =[];

        let insumos = await Entity.tbl_n_insumo.findAll({
            where:{
                INSUMO_ACTIVO: 1
            }
        });

        let fecha_hoy = new Date();

        let mes_actual = fecha_hoy.getMonth();

    
        for(let insumo_iterador of insumos){
            if(insumo_iterador != null){

                let{
                    ID_INSUMO,
                    NOMBRE_INSUMO
                } = insumo_iterador;

                let existencias = 0, ganancia_lotes =0, cantidad_utilizada=0;

                let lotes_insumo = await Entity.tbl_n_lote.findAll({
                    where:{
                        ID_F_INSUMO: ID_INSUMO
                    }
                });

                for(let iterador_lote of lotes_insumo){
                    if(iterador_lote != null){
                        let{
                            CANTIDAD_ACTUAL,
                            CANTIDAD_LOTE,
                            COSTO_LOTE,
                            PRECIO_EFECTIVO
                        } = iterador_lote;

                        existencias+=parseInt(CANTIDAD_ACTUAL);

                        COSTO_LOTE == null?(COSTO_LOTE = 0.00):(undefined)
                        PRECIO_EFECTIVO == null?(PRECIO_EFECTIVO = 0.00):(undefined)

                        CANTIDAD_LOTE == null?(CANTIDAD_LOTE = 0):(undefined)

                        if(parseInt(CANTIDAD_ACTUAL) > 0)
                        {
                            let precio_individual = parseFloat(PRECIO_EFECTIVO) / parseInt(CANTIDAD_LOTE);

                            let costo_individual = parseFloat(COSTO_LOTE) /parseInt(CANTIDAD_LOTE);

                            let margen_ganancia = precio_individual - costo_individual;

                            console.log("margen GANANCIA: ", margen_ganancia);
                            console.log("cantidad_actual: ", CANTIDAD_ACTUAL);
                            
                            console.log("ganancia LOTE. ", ganancia_lotes);

                            ganancia_lotes= parseFloat(ganancia_lotes) + parseFloat(margen_ganancia) * CANTIDAD_ACTUAL;

                            console.log("luego de multi", ganancia_lotes)
                        }

                        let transacciones_insumo = await Entity.tbl_n_transaccion_insumo.findAll({
                            where:{
                                ID_LOTE: iterador_lote.ID_LOTE
                            }
                        });

                        for(let iterador_transaccion of transacciones_insumo){
                            if(iterador_transaccion!=null){
                                let{FECHA_TRANSACCION_INSUMO} = iterador_transaccion;

                                let fecha_js = new Date(FECHA_TRANSACCION_INSUMO);

                                let mes = fecha_js.getMonth();

                                if(mes == mes_actual)
                                {
                                    let {CANTIDAD_INSUMO} = iterador_transaccion;

                                    cantidad_utilizada+= parseInt(CANTIDAD_INSUMO)
                                }
                            }
                        }
                    }
                }

                let fecha_vencimiento_proxima="N/A";

                
                if(lotes_insumo.length>0)
                {
                    fecha_vencimiento_proxima = lotes_insumo[0].FECHA_VENCIMIENTO;

                    let fecha_js = new Date(fecha_vencimiento_proxima)

                    let day = fecha_js.getDate();

                    day<10?(day="0"+day):(day = day)

                    let mes = fecha_js.getMonth();

                    mes<10?(mes="0"+mes):(mes = mes)

                    let anio = fecha_js.getFullYear()

                    fecha_vencimiento_proxima = day +" - "+mes+" - "+anio;
                }

                if(ganancia_lotes == null)
                {
                    ganancia_lotes = 0;
                }

                console.log("inchi GANANCIA: ", ganancia_lotes)
                ganancia_lotes = parseFloat(ganancia_lotes).toFixed(2)

                let n_insumo={
                    insumo: NOMBRE_INSUMO,
                    existencias,
                    fecha_vencimiento_proxima,
                    ganancia_lotes,
                    cantidad_utilizada
                }

                lista_insumos.push(n_insumo);
                
            }
        }

        res.status(200).send(lista_insumos);

    }catch(e)
    {
        
        res.status(500).send({errorMessage:  "Ha ocurrido un error en el servidor."});
    }
}

module.exports={
    resumenCitasPorMes,
    serviciosSolicitadosPorMes,
    inventariosInsumoTotalidad
}