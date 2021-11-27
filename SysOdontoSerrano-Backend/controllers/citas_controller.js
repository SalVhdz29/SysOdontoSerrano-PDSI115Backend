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
const { restart } = require('nodemon');


const obtenerCitas= async(req, res)=>{
    try{

        console.log("ENTRO A LA FUNCION")
        let fecha_hoy = DateTime.now()

        let citas = []

        let citas_hoy = await citas_service.citas_en_fecha(fecha_hoy);
        console.log("OBTUVO DEL SERVICIO: ", citas_hoy)
        for(let it of citas_hoy)
        {
            if(it != null)
            {

               let{
                        ID_SESION,
                        ID_EXPEDIENTE,
                        ID_SERVICIO,
                        HORA_ENTRADA,
                        HORA_SALIDA,
                    } = it;

                    let expediente = await Entity.tbl_n_expediente.findByPk(ID_EXPEDIENTE);

                    let { ID_PACIENTE } = expediente;

                    let paciente = await Entity.tbl_n_paciente.findByPk(ID_PACIENTE);

                    let { ID_PERSONA } = paciente;

                    let persona = await Entity.tbl_n_persona.findByPk(ID_PERSONA);

                    let { NOMBRE_PERSONA, APELLIDO_PERSONA } = persona;

                    let servicio = await Entity.tbl_n_servicio.findByPk(ID_SERVICIO);

                    let { NOMBRE_SERVICIO, PRECIO_SERVICIO } = servicio;
                    let precio_serviciox5 = parseFloat(PRECIO_SERVICIO)*5;
                    precio_serviciox5= parseFloat(precio_serviciox5).toFixed(2);

                    let n_cita = {
                        id_cita: ID_SESION,
                        nombre_persona: NOMBRE_PERSONA + " " + APELLIDO_PERSONA,
                        hora_entrada: HORA_ENTRADA,
                        hora_salida: HORA_SALIDA,
                        id_servicio: ID_SERVICIO,
                        nombre_servicio: NOMBRE_SERVICIO,
                        id_expediente: ID_EXPEDIENTE,
                        precio_servicio: PRECIO_SERVICIO,
                        precio_serviciox5
                    }

                    citas.push(n_cita)
                }
        }
        console.log("A ENVIAR: ", citas)
        res.status(200).send(citas);


    }
    catch(e)
    {
        console.log>("EL ERROR: ==> ",e);
        res.status(500).send({errorMessage:  "Ha ocurrido un error en el servidor."});
    }
}

const guardarCita = async(req, res)=>{
    try{

        let { id_expediente, id_servicio, detalles_cita, fecha_cita, hora_entrada, hora_salida } = req.body;

        let fecha_hoy = DateTime.now()
        console.log("LA HORA DE ENTRADA: ", hora_entrada)
        // hora_entrada = hora_entrada.toISOString();
        // hora_salida = hora_salida.toISOString();
        // fecha_cita = fecha_cita.toISOString();
        console.log("LA HORA DE ENTRADA C: ", hora_entrada)

        let estado_sesion = await Entity.tbl_n_estado_sesion.findByPk(1);

        let nueva_cita = await Entity.tbl_n_sesion.create({
            ID_F_ESTADO_SESION: estado_sesion.ID_ESTADO_SESION,
            ID_EXPEDIENTE: id_expediente,
            ID_SERVICIO: id_servicio,
            FECHA_SESION: fecha_cita,
            FECHA_CREACION_SESION: fecha_hoy,
            HORA_ENTRADA: hora_entrada,
            HORA_SALIDA: hora_salida,
            DETALLES_SESION: detalles_cita
        });


        res.status(200).send({message:"OK"});


    }catch(e)
    {
        console.log>("EL ERROR: ==> ",e);
        res.status(500).send({errorMessage:  "Ha ocurrido un error en el servidor."});
    }
}

const reprogramarCita = async(req, res) =>{
    try{
        let { id_expediente, id_servicio,id_cita, motivo_reprogramacion, fecha_cita, hora_entrada, hora_salida } = req.body;
        console.log("vine: ", req.body)
        let estado_sesion = await Entity.tbl_n_estado_sesion.findByPk(1);
        let fecha_hoy = DateTime.now()
        let nueva_cita = await Entity.tbl_n_sesion.create({
            ID_F_ESTADO_SESION: estado_sesion.ID_ESTADO_SESION,
            ID_EXPEDIENTE: id_expediente,
            ID_SERVICIO: id_servicio,
            FECHA_SESION: fecha_cita,
            FECHA_CREACION_SESION: fecha_hoy,
            HORA_ENTRADA: hora_entrada,
            HORA_SALIDA: hora_salida,
            DETALLES_SESION: "N/A"
        });
        console.log("cree")

        let estado_reprogramada = await Entity.tbl_n_estado_sesion.findByPk(3);

        let cita_reprogramada = await Entity.tbl_n_sesion.update({
            ID_F_ESTADO_SESION: estado_reprogramada.ID_ESTADO_SESION,
            MOTIVO_REPROGRAMACION: motivo_reprogramacion,
        },{
            where:{
                ID_SESION: id_cita
            }
        });
        console.log("actualize")
        res.status(200).send({message:"OK"});

    }catch(e)
    {
        console.log>("EL ERROR: ==> ",e);
        res.status(500).send({errorMessage:  "Ha ocurrido un error en el servidor."});
    }
}

const obtenerServicios =async(req, res)=>{
    try{
        let lista_servicios = await servicios_service.lista_servicios();

        let servicios=[]
        
        for(let it of lista_servicios)
        {
            if(it!= null)
            {
                let { ID_SERVICIO, NOMBRE_SERVICIO, PRECIO_SERVICIO } = it;

                let n_servicio ={
                    id_servicio: ID_SERVICIO,
                    nombre_servicio: NOMBRE_SERVICIO,
                    precio_servicio: PRECIO_SERVICIO
                }

                servicios.push(n_servicio)
            }
        }

        res.status(200).send(servicios);
    }
    catch(e)
    {
        console.log>("EL ERROR: ==> ",e);
        res.status(500).send({errorMessage:  "Ha ocurrido un error en el servidor."});
    }
}

const obtenerCitasAgendadas =async(req,res)=>{
    try{

        let citas = []

        let lista_citas =[]

        citas = await Entity.tbl_n_sesion.findAll({
           where:{
               ID_F_ESTADO_SESION: 1,
           }
       });


       for(let it of citas)
       {
           if(it != null)
           {

              let{
                       ID_SESION,
                       ID_EXPEDIENTE,
                       ID_SERVICIO,
                       HORA_ENTRADA,
                       HORA_SALIDA,
                       DETALLES_SESION,
                       FECHA_SESION
                   } = it;

                   let expediente = await Entity.tbl_n_expediente.findByPk(ID_EXPEDIENTE);

                   let { ID_PACIENTE } = expediente;

                   let paciente = await Entity.tbl_n_paciente.findByPk(ID_PACIENTE);

                   let { ID_PERSONA } = paciente;

                   let persona = await Entity.tbl_n_persona.findByPk(ID_PERSONA);

                   let { NOMBRE_PERSONA, APELLIDO_PERSONA } = persona;

                   let detalle_persona = await Entity.tbl_n_detalle_persona.findAll({
                       where:{
                           ID_PERSONA: ID_PERSONA
                       }
                   });

                   detalle_persona = detalle_persona[0];

                   let numero_de_contacto = detalle_persona.NUMERO_DE_CONTACTO;

                   let servicio = await Entity.tbl_n_servicio.findByPk(ID_SERVICIO);

                   let { NOMBRE_SERVICIO, PRECIO_SERVICIO } = servicio;
                   let precio_serviciox5 = parseFloat(PRECIO_SERVICIO)*5;
                   precio_serviciox5= parseFloat(precio_serviciox5).toFixed(2);

                   let detalles_sesion = DETALLES_SESION;

                   let cuenta = await Entity.tbl_n_saldo.findAll({
                       where:{
                           ID_F_EXPEDIENTE: ID_EXPEDIENTE
                       }
                   });

                   cuenta = cuenta[0];

                   let saldo = cuenta.SALDO;

                   let n_cita = {
                       id_cita: ID_SESION,
                       nombre_persona: NOMBRE_PERSONA + " " + APELLIDO_PERSONA,
                       hora_entrada: HORA_ENTRADA,
                       hora_salida: HORA_SALIDA,
                       id_servicio: ID_SERVICIO,
                       nombre_servicio: NOMBRE_SERVICIO,
                       id_expediente: ID_EXPEDIENTE,
                       precio_servicio: PRECIO_SERVICIO,
                       precio_serviciox5,
                       detalles_sesion,
                       numero_de_contacto,
                       saldo, fecha_sesion: FECHA_SESION

                   }

                   lista_citas.push(n_cita)
               }
       }
       console.log("A ENVIAR: ", lista_citas)
       res.status(200).send(lista_citas);



    }catch(e)
    {
        console.log>("EL ERROR: ==> ",e);
        res.status(500).send({errorMessage:  "Ha ocurrido un error en el servidor."});
    }
}

const cancelarCita =async(req, res)=>{
    try{

        let{id_sesion} = req.body;

        let estado_cancelada = await Entity.tbl_n_estado_sesion.findByPk(4);

        let cita_cancelada = await Entity.tbl_n_sesion.update({
            ID_F_ESTADO_SESION: estado_cancelada.ID_ESTADO_SESION
        },{
            where:{
                ID_SESION: id_sesion
            }
        });

        res.status(200).send({message:"OK"});

    }catch(e)
    {
        console.log>("EL ERROR: ==> ",e);
        res.status(500).send({errorMessage:  "Ha ocurrido un error en el servidor."});
    }
}
module.exports={
    obtenerCitas,
    guardarCita,
    obtenerServicios,
    reprogramarCita,
    obtenerCitasAgendadas,
    cancelarCita
}