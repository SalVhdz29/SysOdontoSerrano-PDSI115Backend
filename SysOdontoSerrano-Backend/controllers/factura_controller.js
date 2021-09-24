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
const citas_service = require("../services/citas_service");
const servicios_service = require("../services/servicios_service");
const facturacion_service = require("../services/facturacion_service");

const obtenerInsumosConsumibles = async(req,res) =>{
    try{
        let fecha_hoy = DateTime.now();

        let lotes = await Entity.tbl_n_lote.findAll();

        let lista_insumos = [];

        console.log("lotes a iterar: ", lotes)

        for(let it of lotes)
        {
            if(it != null)
            {

                let {CANTIDAD_ACTUAL, ID_F_INSUMO, PRECIO_EFECTIVO} = it;

                let insumo_correspondiente = await Entity.tbl_n_insumo.findByPk(ID_F_INSUMO);

                let coincidencia_agregado = await lista_insumos.find(iter=> iter.id_insumo == insumo_correspondiente.ID_INSUMO);

                console.log("insumo y coincidencia", insumo_correspondiente.NOMBRE_INSUMO, " , ",coincidencia_agregado)

                if(coincidencia_agregado != null)
                {
                    console.log("entro en != null")
                    let n_lista_insumo = []
                    for(let iter of lista_insumos)
                    {
                        let pivote={...iter};
                        if(iter.id_insumo == insumo_correspondiente.ID_INSUMO)
                        {
                            let n_cantidad = parseInt(iter.cantidad_insumo) + parseInt(CANTIDAD_ACTUAL);

                            pivote.cantidad_insumo = n_cantidad
                        }
                        n_lista_insumo.push(pivote)
                    }
                    console.log("n_lista_inusmo: ", n_lista_insumo)
                    lista_insumos = n_lista_insumo;
                    console.log("la lsita insumo: ", lista_insumos)
                }
                else
                {
                    console.log("entro en == null")
                    let n_insumo={
                        id_insumo: ID_F_INSUMO,
                        nombre_insumo: insumo_correspondiente.NOMBRE_INSUMO,
                        cantidad_insumo: parseInt(CANTIDAD_ACTUAL),
                        precio_efectivo: PRECIO_EFECTIVO
                    }

                    lista_insumos.push(n_insumo)
                    console.log("la lsita insumox3: ", lista_insumos)
                }
            }
        }

        res.status(200).send(lista_insumos);
    }
    catch(e)
    {
        console.log("error: ", e);
        res.status(500).send({errorMessage:  "Ha ocurrido un error en el servidor."});
    }
}

const obtenerSaldoCliente = async(req, res)=>{

    try{
        let { id_expediente } = req.body;

        let saldo_cliente = parseFloat(0.00);

        let busqueda_saldo = await facturacion_service.obtener_saldo_cliente(id_expediente)

        if(busqueda_saldo == null)
        {
            res.status(500).send({errorMessage:  "No se ha encontrado saldo del cliente en los registros"});
        }
        else{

            saldo_cliente = busqueda_saldo;
            res.status(200).send({saldo_cliente: saldo_cliente})
        }


    }
    catch(e)
    {
        console.log("Error: ",e);
        res.status(500).send({errorMessage:  "Ha ocurrido un error en el servidor."});
    }
}

const guardarFactura = async(req, res)=>{
    try{

        let { id_expediente, servicios_factura, insumos_factura, cantidad_pagada, subtotal_factura, deber } = req.body;

        let sesiones = await Entity.tbl_n_sesion.findAll({
            where:{
                ID_EXPEDIENTE: id_expediente
            }
        });

        let sesion = null;

        sesion = sesiones[sesiones.length - 1];

        let upd_sesion = await Entity.tbl_n_sesion.update({
            ID_F_ESTADO_SESION: 2
        },{
            where:{
                ID_SESION: sesion.ID_SESION
            }
        })

        let n_pago_sesion = await Entity.tb_n_pago_sesion.create({
            ID_F_SESION: sesion.ID_SESION,
            CANTIDAD_PAGADA: cantidad_pagada, // abono o total completo (asumiendo que si tenia saldo deudor tambien se paga sin el deber.)
            PAGO_CON_DEUDA: deber,
            TOTAL_FACTURA: subtotal_factura// total de detalles
        });

        let saldo_cliente = await facturacion_service.obtener_saldo_cliente(id_expediente);

        if((parseFloat(cantidad_pagada) > parseFloat(subtotal_factura) && parseFloat(saldo_cliente)>0) || deber == true)
        {
            let restante = parseFloat(cantidad_pagada) - parseFloat(subtotal_factura);
            let n_saldo = parseFloat(0.00)
            if(restante < 0)
            {
                n_saldo = parseFloat(saldo_cliente) + ((-1)*parseFloat(restante))
            }
            else{
                n_saldo = parseFloat(saldo_cliente) - parseFloat(restante);
            }
            

            let saldo_update = await Entity.tbl_n_saldo.update({
                SALDO: n_saldo
            },{
                where:{
                    ID_F_EXPEDIENTE: id_expediente
                }
            });

        }

        for(let iterador_insumos of insumos_factura)
        {
            let { id_insumo, cantidad, subtotal} = iterador_insumos;

            let lote = await Entity.tbl_n_lote.findAll({
                where:{
                    ID_F_INSUMO: id_insumo
                }
            });

            let restante = parseInt(cantidad);

            let fecha_hoy =  DateTime.now()

            console.log("LOS LOTES: ", lote)

           for(let iterador_lote of lote)
           {
               console.log("ITERADOR_LOTE: ", iterador_lote, "restante: ", restante);
               if(parseInt(iterador_lote.CANTIDAD_ACTUAL) > 0 && parseInt(iterador_lote.CANTIDAD_ACTUAL) >= parseInt(restante) && parseInt(restante)>0)
               {
                let transaccion_insumo = await Entity.tbl_n_transaccion_insumo.create({
                    ID_LOTE: iterador_lote.ID_LOTE,
                    CANTIDAD_INSUMO: restante,
                    FECHA_TRANSACCION_INSUMO: fecha_hoy,
                    ID_F_PAGO_SESION: n_pago_sesion.ID_PAGO_SESION
                });

                let restante_cantidad = iterador_lote.CANTIDAD_ACTUAL - restante;

                let lote_upd=await Entity.tbl_n_lote.update({
                    CANTIDAD_ACTUAL: restante_cantidad,

                }
                ,
                {
                    where:{
                        ID_LOTE: iterador_lote.ID_LOTE
                    }
                }
                )

                restante = restante - iterador_lote.CANTIDAD_ACTUAL;
               }
           }


          
        }
        res.status(200).send({message:"OK"})

    }catch(e)
    {
        console.log("Error: ",e)
        res.status(500).send({errorMessage:  "Ha ocurrido un error en el servidor."});
    }

}
module.exports={
    obtenerInsumosConsumibles,
    obtenerSaldoCliente,
    guardarFactura
}