
'use strict'
// importamos mediante require modelos y librerias necesarias.

//Conexión a BD.
const {sequelize} = require('../models/index.js');
//importamos modelo para usuarios.
let init_models= require("../models/init-models");
//Servicio
const servicio_update_expediente = require("../services/updateExpediente");

var Entity= init_models(sequelize); // inicialización de los modelos.


const _NuevoExpediente = async(req, res) =>{
	var nombre = req.body.nombre_paciente;
	var apellido = req.body.apellido_paciente;
	var fecha_nacimiento = req.body.fecha_nacimiento;
	var sexo = req.body.sexo;
    var correo = req.body.correo;
    var activo = 1;
    var contacto = req.body.telefono;
    var dui = req.body.dui;
    var direccion = req.body.direccion;
    var fecha = req.body.ultima_fecha;
    

    let persona = await Entity.tbl_n_persona.create({

        NOMBRE_PERSONA: nombre,
        APELLIDO_PERSONA: apellido,
        FECHA_NACIMIENTO: fecha_nacimiento
    });

    let detalle_persona = await Entity.tbl_n_detalle_persona.create({
        ID_PERSONA: persona.ID_PERSONA,
        NUMERO_DE_CONTACTO: contacto,
        DUI: dui,
        DIRECCION: direccion
    });
    let paciente = await Entity.tbl_n_paciente.create({
        ID_PERSONA: persona.ID_PERSONA,
        SEXO: sexo,
        CORREO_ELECTRONICO_PACIENTE: correo,
        PACIENTE_ACTIVO: activo
    });

    let expediente = await Entity.tbl_n_expediente.create({
        ID_PACIENTE: paciente.ID_PACIENTE,
        FECHA_CREACION_EXPEDIENTE: fecha
    });


    res.status(200).send({message:"Se guardo expediente"});
}
const _UpdateExpediente = async(req, res) =>{

     //var correo = req.body.correo;
     //var contacto = req.body.telefono;
     var direccion = req.body.direccion;
     var id_exp = req.body.id_expediente;
     var { nombre_paciente, correo, direccion, apellido_paciente, id_expediente, telefono} = req.body;
    
      
    let expediente_con = await Entity.tbl_n_expediente.findByPk(id_expediente);

    let paciente_con = await Entity.tbl_n_paciente.findAll({
        where:{
            ID_PACIENTE: expediente_con.ID_PACIENTE
        }
    });
  
    const persona = await Entity.tbl_n_persona.findAll({
        where:{
            ID_PERSONA: paciente_con[0].ID_PERSONA
        }
    });

    let detalle_persona_consulta = await Entity.tbl_n_detalle_persona.findAll({
        where:{
            ID_PERSONA: persona[0].ID_PERSONA
        }
    });
    let id_persona = persona[0].ID_PERSONA;
    let id_paciente = paciente_con[0].ID_PACIENTE;
    let id_detalle = detalle_persona_consulta[0].ID_DETALLE_PERSONA;
  
    let paciente = await Entity.tbl_n_paciente.update(
        {
        CORREO_ELECTRONICO_PACIENTE: correo,
      
        },{
        where:{
        ID_PACIENTE: id_paciente
    }});

    let persona_r = await Entity.tbl_n_persona.update(
        {
            NOMBRE_PERSONA: nombre_paciente,
            APELLIDO_PERSONA: apellido_paciente
        },
        {
            where:{
                ID_PERSONA: id_persona
            }
        });

        let detalle_persona = await Entity.tbl_n_detalle_persona.update({
            NUMERO_DE_CONTACTO: telefono,
            DIRECCION: direccion
        },{
        where:{
            ID_DETALLE_PERSONA: id_detalle
        }});

    res.status(200).send({message:"Actualicion completada del servidor"});
}
const _ObtenerExpediente = async(req, res) =>{

    let persona_consulta = await Entity.tbl_n_persona.findAll({
    });
    let detalle_persona_consulta = await Entity.tbl_n_detalle_persona.findAll({
    });
    let expediente_consulta = await Entity.tbl_n_expediente.findAll({
    });
    let paciente_consulta = await Entity.tbl_n_paciente.findAll({
    });

    let re_servicio = [];
    re_servicio = servicio_update_expediente.obtenerExpedientes(paciente_consulta,persona_consulta,detalle_persona_consulta,expediente_consulta);

    res.status(200).send(re_servicio);
}
const _ObtenerUnExpediente = async(req, res) =>{

    let persona_consulta = await Entity.tbl_n_persona.findAll({
    });
    let detalle_persona_consulta = await Entity.tbl_n_detalle_persona.findAll({
    });
    let expediente_consulta = await Entity.tbl_n_expediente.findAll({
    });
    let paciente_consulta = await Entity.tbl_n_paciente.findAll({
        where:{
            ID_PERSONA: 36
        }
    });

    let re_servicio = [];
    re_servicio = servicio_update_expediente.obtenerExpedientes(paciente_consulta,persona_consulta,detalle_persona_consulta,expediente_consulta);


    res.status(200).send(re_servicio);
}

module.exports = {
    _NuevoExpediente,
    _UpdateExpediente,
    _ObtenerExpediente,
    _ObtenerUnExpediente
}

