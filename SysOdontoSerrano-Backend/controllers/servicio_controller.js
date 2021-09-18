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
                    COSTO_SERVICIO,
                    PRECIO_SERVICIO,
                    MINIMO_NUMERO_CITAS,
                    MAXIMO_NUMERO_CITAS,
                    SERVICIO_ACTIVO,
                    } = servicio_r_it;

                // console.log("EL NOMBRE: ", NOMBRE_SERVICIO);

                let id_servicio = ID_SERVICIO;
                let nombre_servicio= NOMBRE_SERVICIO;
                let descripcion_servicio = DESCRIPCION_SERVICIO;
                let costo_servicio = COSTO_SERVICIO;
                let precio_servicio = PRECIO_SERVICIO;
                let minimo_numero_citas = MINIMO_NUMERO_CITAS;
                let maximo_numero_citas = MAXIMO_NUMERO_CITAS;
                let servicio_activo = SERVICIO_ACTIVO;

                let servicio_pivote = {id_servicio,
                                      nombre_servicio,
                                      descripcion_servicio,
                                      costo_servicio,
                                      precio_servicio,
                                      minimo_numero_citas,
                                      maximo_numero_citas,
                                      servicio_activo,
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
            console.log("IGUALES");
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
            precio_servicio,
            } = req.body;

        console.log("Se muestra: ", req.body);

        //creando nuevo servicio
        let nuevo_servicio = await Entity.tbl_n_servicio.create({
            NOMBRE_SERVICIO: nombre_servicio,
            DESCRIPCION_SERVICIO: descripcion_servicio,
            COSTO_SERVICIO: costo_servicio,
            PRECIO_SERVICIO: precio_servicio,
            MINIMO_NUMERO_CITAS: minimo_numero_citas,
            MAXIMO_NUMERO_CITAS: maximo_numero_citas,
            SERVICIO_ACTIVO: servicio_activo,
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
            costo_servicio,
            precio_servicio,
            maximo_numero_citas,
            minimo_numero_citas,
            servicio_activo,
        } = req.body;

        console.log("Se muestra: ", req.body);
        let servicio=null;
        //actualización de servicio

            servicio = await Entity.tbl_n_servicio.update({
                NOMBRE_SERVICIO: nombre_servicio,
                DESCRIPCION_SERVICIO: descripcion_servicio,
                COSTO_SERVICIO: costo_servicio,
                PRECIO_SERVICIO: precio_servicio,
                MAXIMO_NUMERO_CITAS: maximo_numero_citas,
                MINIMO_NUMERO_CITAS: minimo_numero_citas,
                SERVICIO_ACTIVO: servicio_activo,
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

module.exports={
    crear_servicio,
    actualizar_servicio,
    servicios_registrados,
    cambiar_estado_servicio,

}

