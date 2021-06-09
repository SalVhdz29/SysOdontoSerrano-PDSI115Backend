
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

	var nombre = "ulises menjivar";
	var apellido = "menjivar";
	var fecha = "06-07-2121";
	var sexo = "hombre";
    var correo = "correo";
    var activo = 1;
    var contacto = "123456";
    var dui = "123445-1";
    var direccion = "a la chinga";
    var fecha = "05-05-2021";

    let persona = await Entity.tbl_n_persona.create({

        NOMBRE_PERSONA: nombre,
        APELLIDO_PERSONA: apellido,
        FECHA_NACIMIENTO: fecha
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


    res.status(200).send({message:"Se guardo la mierda"});
}
const _UpdateExpediente = async(req, res) =>{

    var nombre = "ulises menjivar";
    var apellido = "menjivar";
    var fecha = "06-07-2121";
    var sexo = "hombre";
    var correo = "wilber@actualizo";
    var activo = 1;
    var contacto = "777777";
    var dui = "99999-5";
    var direccion = "vete a ka dobler el doble";
    var fecha = "05-05-2021";
    var re_servicio = new Object();

    const persona = await Entity.tbl_n_persona.findAll({
        where:{
            ID_PERSONA: 36
        }
    });
    
    let paciente_consulta = await Entity.tbl_n_paciente.findAll({
        where:{
            ID_PERSONA: persona[0].ID_PERSONA
        }
    });
    let detalle_persona_consulta = await Entity.tbl_n_detalle_persona.findAll({
        where:{
            ID_PERSONA: persona[0].ID_PERSONA
        }
    });

    re_servicio = servicio_update_expediente.servicio_update_expediente(correo,activo,contacto,direccion,paciente_consulta,detalle_persona_consulta);

    if(re_servicio['correo']){
        let paciente = await Entity.tbl_n_paciente.update(
        {
        CORREO_ELECTRONICO_PACIENTE: correo
        },{
        where:{
        ID_PERSONA: persona[0].ID_PERSONA,
    }
    });
    }
    if(re_servicio['activo']){
        let paciente = await Entity.tbl_n_paciente.update(
        {
        PACIENTE_ACTIVO: activo
        },{
        where:{
        ID_PERSONA: persona[0].ID_PERSONA,
    }
    });
    }
    if(re_servicio['contacto']){
        let detalle_persona = await Entity.tbl_n_detalle_persona.update(
        {
            NUMERO_DE_CONTACTO: contacto
        },{
        where:{
            ID_PERSONA: persona[0].ID_PERSONA
        }
    });

    }
    if(re_servicio['direccion']){
        let detalle_persona = await Entity.tbl_n_detalle_persona.update(
        {
            DIRECCION: direccion
        },{
        where:{
            ID_PERSONA: persona[0].ID_PERSONA
        }
    });

    }
    res.status(200).send({message:"Se actualizo la mierda"});
}
module.exports = {
    _NuevoExpediente,
    _UpdateExpediente
}

