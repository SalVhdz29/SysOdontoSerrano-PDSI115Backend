'use strict'
// importamos mediante require modelos y librerias necesarias.

//Conexión a BD.
const {sequelize} = require('../models/index.js');
//importamos modelo para recursos.
let init_models= require("../models/init-models");

var Entity= init_models(sequelize); // inicialización de los modelos.
const { DateTime } = require("luxon");

//Servicios
const auth_service = require("../services/auth_service");

//actualiza el valor de activo del recurso.
const cambiar_estado_recurso = async(req, res) =>{

    try{

        let { id_recurso } = req.body;

        let  {user}  = req;

        if(id_recurso != user)
        {

       

        let recurso = await Entity.tbl_n_recurso.findByPk(id_recurso);

        let estado_activo = recurso.USUARIO_ACTIVO;

        await Entity.tbl_n_recurso.update({ RECURSO_ACTIVO: !estado_activo },{
            where: {
                ID_RECURSO: id_recurso
            }
        });

        res.status(200).send({message:"OK"});
        }
        else{
            console.log("VINO A IGUALES");
            res.status(200).send({message:" No puede actualizar el estado en sesion"});
        }

    }catch(e)
    {
        console.log>("EL ERROR: ==> ",e);
        res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."});
    }
}

//creacion de un nuevo recurso.
const crear_recurso = async(req, res) =>{

    try{

        let {
            nombre_recurso,
            descripcion_recurso,
            recurso_activo,
        } = req.body;

        console.log("lo obtenido: ", req.body);
        let fecha_hoy = DateTime.now();

        let tipo_recurso = await Entity.tbl_n_tipo_recurso.findByPk(1);

        //creando nuevo recurso
        let nuevo_recurso = await Entity.tbl_n_recurso.create({
            NOMBRE_RECURSO: nombre_recurso,
            DESCRIPCION_RECURSO: descripcion_recurso,
            RECURSO_ACTIVO: recurso_activo,
            FECHA_CREACION_RECURSO: fecha_hoy,
            FECHA_MODIFICACION_RECURSO: fecha_hoy,
            ID_TIPO_RECURSO: tipo_recurso.ID_TIPO_RECURSO
        });

        let id_recurso_creado = nuevo_usuario.ID_RECURSO;
        console.log("ID_RECURSO: ", id_recurso_creado);

        res.status(200).send({message:"OK"});

    }catch(e)
    {
        console.log(e);
        res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."});
    }
}

//actualizar datos del recurso.

const actualizar_usuario =async(req, res) =>{

    try{

        let {
            id_recurso,
            nombre_recurso,
            descripcion_recurso,
            recurso_activo,
        } = req.body;

        console.log("LO OBTENIDO: ", req.body);

        let fecha_hoy = DateTime.now();
        let recurso=null;
        //actualización de recurso

            recurso = await Entity.tbl_n_recurso.update({
                NOMBRE_RECURSO: nombre_recurso,
                DESCRIPCION_RECURSO: descripcion_recurso,
                RECURSO_ACTIVO: recurso_activo,
                FECHA_MODIFICACION_RECURSO: fecha_hoy
            },{where:{
                ID_RECURSO: id_recurso
            }});

    }catch(e)
    {
        console.log(e);
        res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."});
    }

}

module.exports={
    cambiar_estado_recurso,
    crear_recurso,
    actualizar_recurso
}

