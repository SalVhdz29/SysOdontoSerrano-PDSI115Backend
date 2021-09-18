'use strict'
// importamos mediante require modelos y librerias necesarias.

//Conexión a BD.
const {sequelize} = require('../models/index.js');
//importamos modelo para servicios.
let init_models= require("../models/init-models");

var Entity= init_models(sequelize); // inicialización de los modelos.
const { DateTime } = require("luxon");

//Servicios
const auth_service = require("../services/auth_service");

//obtiene la lista de servicios registrados de tipo usuario.
const servicios_registrados = async(req, res)=>{

    try{

        //variables de Output.
        let lista_servicios =[];

        const servicios_registrados = await Entity.tbl_n_servicio.findAll();


        if(servicios_registrados.length !=0)
        {
            console.log("entra SERVICIOS_REGISTRADOS");
            //servicios_registrados.map(async servicio_r_it =>{
            console.log("SERVICIOS REGISTRADOS: ", servicios_registrados);
            for(let servicio_r_it of servicios_registrados){

                let { ID_SERVICIO,
                    NOMBRE_SERVICIO,
                    DESCRIPCION_SERVICIO,
                    FECHA_CREACION_SERVICIO,
                    SERVICIO_ACTIVO,
                    RUTA_SERVICIO,
                    ID_TIPO_SERVICIO
                    } = servicio_r_it;

                // console.log("EL NOMBRE: ", NOMBRE_SERVICIO);

                let id_servicio = ID_SERVICIO;
                let nombre_servicio= NOMBRE_SERVICIO;
                let descripcion_servicio = DESCRIPCION_SERVICIO;
                let fecha_creacion_servicio = FECHA_CREACION_SERVICIO;
                let servicio_activo = SERVICIO_ACTIVO;
                let ruta_servicio = RUTA_SERVICIO;
                let id_tipo_servicio = ID_TIPO_SERVICIO

                let tipo_servicio = await Entity.tbl_n_tipo_servicio.findByPk(id_tipo_servicio);
                let nombre_tipo_servicio = tipo_servicio.NOMBRE_TIPO_SERVICIO;
                


                let servicio_pivote = {id_servicio,
                                      nombre_servicio,
                                      descripcion_servicio,
                                      fecha_creacion_servicio,
                                      servicio_activo,
                                      ruta_servicio,
                                      tipo_servicio:{id_tipo_servicio, nombre_tipo_servicio}
                                     };

                console.log("SERVICIO_PIVOTE: ", servicio_pivote);

                lista_servicios.push(servicio_pivote);

            } // fin for servicios_registrados.
        }
        res.status(200).send(lista_servicios);

    }
    catch(e)
    {
        console.log>("EL ERROR: ==> ",e);
        res.status(500).send({errorMessage:  "Ha ocurrido un error en el servidor."});
    }
}

//actualiza el valor de activo del servicio.
const cambiar_estado_servicio = async(req, res) =>{

    try{

        let { id_servicio } = req.body;

        let  {user}  = req;

        if(id_servicio != user)
        {

       

        let servicio = await Entity.tbl_n_servicio.findByPk(id_servicio);

        let estado_activo = servicio.SERVICIO_ACTIVO;

        await Entity.tbl_n_servicio.update({ SERVICIO_ACTIVO: !estado_activo },{
            where: {
                ID_SERVICIO: id_servicio
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

//creacion de un nuevo servicio.
const crear_servicio = async(req, res) =>{

    try{

        let {
            nombre_servicio,
            descripcion_servicio,
            servicio_activo,
            ruta_servicio,
            tipo_servicio
        } = req.body;

        console.log("Se muestra: ", req.body);
        let fecha_hoy = DateTime.now();

        let tipo_servicio_escogido = await Entity.tbl_n_tipo_servicio.findByPk(tipo_servicio);

        //creando nuevo servicio
        let nuevo_servicio = await Entity.tbl_n_servicio.create({
            NOMBRE_SERVICIO: nombre_servicio,
            DESCRIPCION_SERVICIO: descripcion_Servicio,
            SERVICIO_ACTIVO: servicio_activo,
            FECHA_CREACION_SERVICIO: fecha_hoy,
            FECHA_MODIFICACION_SERVICIO: fecha_hoy,
            ID_TIPO_SERVICIO: tipo_servicio_escogido.ID_TIPO_SERVICIO,
            RUTA_SERVICIO: ruta_Servicio
        });

        let id_servicio_creado = nuevo_servicio.ID_SERVICIO;
        console.log("ID_SERVICIO: ", id_servicio_creado);

        res.status(200).send({message:"OK"});

    }catch(e)
    {
        console.log(e);
        res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."});
    }
}

//actualizar datos del servicio.

const actualizar_servicio =async(req, res) =>{

    try{

        let {
            id_servicio,
            nombre_servicio,
            descripcion_servicio,
            servicio_activo,
            tipo_servicio,
            ruta_servicio
        } = req.body;

        console.log("Se muestra: ", req.body);

        let tipo_servicio_escogido = await Entity.tbl_n_tipo_servicio.findByPk(tipo_servicio);

        let fecha_hoy = DateTime.now();
        let servicio=null;
        //actualización de servicio

            servicio = await Entity.tbl_n_servicio.update({
                NOMBRE_SERVICIO: nombre_servicio,
                DESCRIPCION_SERVICIO: descripcion_servicio,
                SERVICIO_ACTIVO: servicio_activo,
                FECHA_MODIFICACION_SERVICIO: fecha_hoy,
                ID_TIPO_SERVICIO: tipo_servicio_escogido.ID_TIPO_SERVICIO,
                RUTA_SERVICIO: ruta_Servicio
            },{where:{
                ID_SERVICIO: id_servicio
            }});
            res.status(200).send({message:"OK"});
    }catch(e)
    {
        console.log(e);
        res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."});
    }

}

//lista de tipos servicio.

const lista_tipos_servicio = async(req, res) =>{
    try{
        const tipos_servicio_registrados = await Entity.tbl_n_tipo_servicio.findAll();

        res.status(200).send({tipos_servicio_registrados});
    }catch(e)
    {
        console.log(e);
        res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."});
    }
}



module.exports={
    crear_servicio,
    actualizar_servicio,
    servicios_registrados,
    cambiar_estado_servicio,
    lista_tipos_servicio
}

