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

//obtiene la lista de recursos registrados de tipo usuario.
const recursos_registrados = async(req, res)=>{

    try{

        //variables de Output.
        let lista_recursos =[];

        const recursos_registrados = await Entity.tbl_n_recurso.findAll();


        if(recursos_registrados.length !=0)
        {
            console.log("entra RECURSOS_REGISTRADOS");
            //recursos_registrados.map(async recurso_r_it =>{
            console.log("RECURSOS REGISTRADOS: ", recursos_registrados);
            for(let recurso_r_it of recursos_registrados){

                let { ID_RECURSO,
                    NOMBRE_RECURSO,
                    DESCRIPCION_RECURSO,
                    FECHA_CREACION_RECURSO,
                    RECURSO_ACTIVO,
                    RUTA_RECURSO,
                    ID_TIPO_RECURSO
                    } = recurso_r_it;

                // console.log("EL NOMBRE: ", NOMBRE_RECURSO);

                let id_recurso = ID_RECURSO;
                let nombre_recurso= NOMBRE_RECURSO;
                let descripcion_recurso = DESCRIPCION_RECURSO;
                let fecha_creacion_recurso = FECHA_CREACION_RECURSO;
                let recurso_activo = RECURSO_ACTIVO;
                let ruta_recurso = RUTA_RECURSO;
                let id_tipo_recurso = ID_TIPO_RECURSO

                let tipo_recurso = await Entity.tbl_n_tipo_recurso.findByPk(id_tipo_recurso);
                let nombre_tipo_recurso = tipo_recurso.NOMBRE_TIPO_RECURSO;
                


                let recurso_pivote = {id_recurso,
                                      nombre_recurso,
                                      descripcion_recurso,
                                      fecha_creacion_recurso,
                                      recurso_activo,
                                      ruta_recurso,
                                      tipo_recurso:{id_tipo_recurso, nombre_tipo_recurso}
                                     };

                console.log("RECURSO_PIVOTE: ", recurso_pivote);

                lista_recursos.push(recurso_pivote);

            } // fin for recursos_registrados.
        }
        res.status(200).send(lista_recursos);

    }
    catch(e)
    {
        console.log>("EL ERROR: ==> ",e);
        res.status(500).send({errorMessage:  "Ha ocurrido un error en el servidor."});
    }
}

//actualiza el valor de activo del recurso.
const cambiar_estado_recurso = async(req, res) =>{

    try{

        let { id_recurso } = req.body;

        let  {user}  = req;

        if(id_recurso != user)
        {

       

        let recurso = await Entity.tbl_n_recurso.findByPk(id_recurso);

        let estado_activo = recurso.RECURSO_ACTIVO;

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
            descripcion_Recurso,
            recurso_activo,
            ruta_Recurso,
            tipo_recurso
        } = req.body;

        console.log("Se muestra: ", req.body);
        let fecha_hoy = DateTime.now();

        let tipo_recurso_escogido = await Entity.tbl_n_tipo_recurso.findByPk(tipo_recurso);

        //creando nuevo recurso
        let nuevo_recurso = await Entity.tbl_n_recurso.create({
            NOMBRE_RECURSO: nombre_recurso,
            DESCRIPCION_RECURSO: descripcion_Recurso,
            RECURSO_ACTIVO: recurso_activo,
            FECHA_CREACION_RECURSO: fecha_hoy,
            FECHA_MODIFICACION_RECURSO: fecha_hoy,
            ID_TIPO_RECURSO: tipo_recurso_escogido.ID_TIPO_RECURSO,
            RUTA_RECURSO: ruta_Recurso
        });

        let id_recurso_creado = nuevo_recurso.ID_RECURSO;
        console.log("ID_RECURSO: ", id_recurso_creado);

        res.status(200).send({message:"OK"});

    }catch(e)
    {
        console.log(e);
        res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."});
    }
}

//actualizar datos del recurso.

const actualizar_recurso =async(req, res) =>{

    try{

        let {
            id_recurso,
            nombre_recurso,
            descripcion_recurso,
            recurso_activo,
            tipo_recurso,
            ruta_Recurso
        } = req.body;

        console.log("Se muestra: ", req.body);

        let tipo_recurso_escogido = await Entity.tbl_n_tipo_recurso.findByPk(tipo_recurso);

        let fecha_hoy = DateTime.now();
        let recurso=null;
        //actualización de recurso

            recurso = await Entity.tbl_n_recurso.update({
                NOMBRE_RECURSO: nombre_recurso,
                DESCRIPCION_RECURSO: descripcion_recurso,
                RECURSO_ACTIVO: recurso_activo,
                FECHA_MODIFICACION_RECURSO: fecha_hoy,
                ID_TIPO_RECURSO: tipo_recurso_escogido.ID_TIPO_RECURSO,
                RUTA_RECURSO: ruta_Recurso
            },{where:{
                ID_RECURSO: id_recurso
            }});
            res.status(200).send({message:"OK"});
    }catch(e)
    {
        console.log(e);
        res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."});
    }

}

//lista de tipos recurso.

const lista_tipos_recurso = async(req, res) =>{
    try{
        const tipos_recurso_registrados = await Entity.tbl_n_tipo_recurso.findAll();

        res.status(200).send({tipos_recurso_registrados});
    }catch(e)
    {
        console.log(e);
        res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."});
    }
}



module.exports={
    crear_recurso,
    actualizar_recurso,
    recursos_registrados,
    cambiar_estado_recurso,
    lista_tipos_recurso
}

