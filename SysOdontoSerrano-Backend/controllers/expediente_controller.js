
'use strict'
// importamos mediante require modelos y librerias necesarias.

//Conexión a BD.
const {sequelize} = require('../models/index.js');
//importamos modelo para usuarios.
let init_models= require("../models/init-models");

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
module.exports = {
    _NuevoExpediente
}

