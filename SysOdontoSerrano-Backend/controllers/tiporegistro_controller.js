'use strict'
// importamos mediante require modelos y librerias necesarias.

//Conexión a BD.
const {sequelize} = require('../models/index.js');
//importamos modelo para tiporecursos.
let init_models= require("../models/init-models");

var Entity= init_models(sequelize); // inicialización de los modelos.
//const { DateTime } = require("luxon");

//Servicios
const auth_service = require("../services/auth_service");

//obtiene la lista de tiporecurso registrados de tipo usuario.
const tiporecurso_registrados = async(req, res)=>{

    try{

        //variables de Output.
        let lista_tiporecurso =[];

        const tiporecurso_registrados = await Entity.tbl_n_tipo_recurso.findAll({
            where:{
                ID_TIPO_RECURSO: 1
            }
        });

        const usuarios_roles = await Entity.tbl_n_usuario.findAll({
            where:{
                ID_TIPO_RECURSO: 2,
                TIPO_RECURSO_ACTIVO: true
            }
        });

        const recursos_registrados = await Entity.tbl_n_recurso.findAll({});



        if(tiporecurso_registrados.length !=0)
        {
            console.log("ENTRAMOS EN TIPORECURSOS_REGISTRADOS");
            //usuarios_registrados.map(async usuario_r_it =>{
            console.log("TIPORECURSOS REGISTRADOS: ", tipo_recurso_registrados);
            for(let tipo_recurso_r_it of tipo_recurso_registrados){

                let { ID_TIPO_RECURSO,                     
                     NOMBRE_TIPO_RECURSO,
                    TIPO_RECURSO_ACTIVO
                    } = tipo_recurso_r_it;

                console.log("EL NOMBRE: ", NOMBRE_TIPO_RECURSO);

                let id_tipo_recurso = ID_TIPO_RECURSO;
                let nombre_tipo_recurso = NOMBRE_TIPO_RECURSO;                                
                let tipo_recurso_activo = TIPO_RECURSO_ACTIVO;               
               

                let recurso = [];


                let recurso_tipo_recurso = await Entity.tbl_n_recurso.findAll({
                    where:{
                        ID_TIPO_RECURSO: id_usuario,
                        RECURSO_ACTIVO: true
                    }
                });
                console.log("RECURSOS ENCONTRADOS: ", recurso_tipo_recurso);




                if(recurso_tipo_recurso.length != 0)
                {
                    recurso_tipo_recurso.map(recurso_it =>{
                        let tipo_recurso_recurso = tipo_recurso_recurso.filter(tipo_recurso_ro_it => tipo_recurso_ro_it.ID_TIPO_RECURSO == recurso_it.ID_RECURSO);

                        console.log("LO QUE FILTRO: ", tipo_recurso_recurso);

                        let { ID_TIPO_RECURSO, NOMBRE_TIPO_RECURSO } = tipo_recurso_recurso[0];

                        let id_tipo_recurso = ID_TIPO_RECURSO;
                        let nombre_tipo_recurso = NOMBRE_TIPO_RECURSO;

                        let recurso_pivote = {id_tipo_recurso, nombre_tipo_recurso};

                        recurso.push(recurso_pivote);

                    });
                }
                
                let tipo_recurso_pivote = {id_tipo_recurso,
                                      nombre_tipo_recurso,                                      
                                      recurso,
                                      tipo_recurso_activo
                                     };

                console.log("TIPORECURSO_PIVOTE: ", tipo_recurso_pivote);

                lista_tiporecurso.push(tipo_recurso_pivote);

            } // fin for usuarios_registrados.
        }
        res.status(200).send(lista_tiporecurso);

    }
    catch(e)
    {
        console.log>("EL ERROR: ==> ",e);
        res.status(500).send({errorMessage:  "Ha ocurrido un error en el servidor."});
    }
}


//actualiza el valor de activo de un usuario registrado.
const cambiar_estado_tiporecurso = async(req, res) =>{

    try{

        let { id_tipo_recurso } = req.body;

        let  {tipo_r}  = req;

        if(id_tipo_recurso != tipo_r)
        {

       

        let tipo_recurso = await Entity.tbl_n_tipo_recurso.findByPk(id_tipo_recurso);

        let tipo_recurso_activo = tipo_recurso.TIPO_RECURSO_ACTIVO;

        await Entity.tbl_n_tipo_recurso.update({ TIPO_RECURSO_ACTIVO: !estado_activo },{
            where: {
                ID_TIPO_RECURSO: id_tipo_recurso
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
/*
//obtener usuario roles
const usuario_roles = async(req, res) =>{
    try{

        let lista_roles =[];
        //obteniendo usuarios de tipo usuario rol.
        const usuarios_roles = await Entity.tbl_n_usuario.findAll({
            where:{
                ID_TIPO_USUARIO: 2,
                USUARIO_ACTIVO: true
            }
        });
        if(usuario_roles.length)
        {
            for(let rol_it of usuarios_roles )
            {
                
    
                let nombre_usuario = rol_it.NOMBRE_USUARIO;
    
                let id_usuario = rol_it.ID_USUARIO;
    
                let rol_pivote={id_usuario, nombre_usuario};
    
                lista_roles.push(rol_pivote);
            }

        }

        res.status(200).send(lista_roles);

    }
    catch(e)
    {
        console.log(e);
        res.status(500).send({errorMessage:"Excepción del servidor."})
    }
}
*/




//creacion de un nuevo tiporecurso.
const crear_tipo_recurso = async(req, res) =>{

    try{

        let {
            nombre_tipo_recurso,            
            tipo_recurso_activo,
            recurso,            
        } = req.body;

        console.log("lo obtenido: ", req.body);
        

        let tipo_recurso = await Entity.tbl_n_tipo_recurso.findByPk(1);

        //creando nuevo TipoRecurso.
        let nuevo_tipo_recurso = await Entity.tbl_n_tipo_recurso.create({
            NOMBRE_TIPO_RECURSO: nombre_tipo_recurso,            
            TIPO_RECURSO_ACTIVO: tipo_recurso_activo
        });

        let id_tipo_recurso_creado = nuevo_tipo_recurso.ID_TIPO_RECURSO;
        console.log("ID_TIPO_RECURSO: ", id_tipo_recurso_creado);
        
        //relacionando roles con el usuario.

        if(recurso.length != 0)
        {

                for(let recurso_it of recurso)
                {
                    let { id_tipo_recurso } = recurso_it;

                    let recurso_pivote = await Entity.tbl_n_tipo_recurso.findByPk(id_tipo_recurso);

                    let recurso_creado = await Entity.tbl_n_recurso.update({                        
                        ID_TIPO_RECURSO: id_tipo_recurso_creado                        
                    },{
                    where: {
                        ID_ROL: rol_pivote.ID_RECURSO                        
                      }}
                    );

                }
        }

        res.status(200).send({message:"OK"});




    }catch(e)
    {
        console.log(e);
        res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."});
    }
}

//actualizar datos de tiporecurso.

const actualizar_tipo_recurso =async(req, res) =>{

    try{

        let {
            id_tipo_recurso,
            nombre_tipo_recurso,            
            tipo_recurso_activo,
            recurso            
        } = req.body;

        console.log("LO OBTENIDO: ", req.body);

        
        let tipo_recurso=null;
        //actualización de tiporecurso.

            tipo_recurso = await Entity.tbl_n_tipo_recurso.update({
                NOMBRE_TIPO_RECURSO: nombre_tipo_recurso,                
                TIPO_RECURSO_ACTIVO: tipo_recurso_activo                
            },{where:{
                ID_TIPO_RECURSO: id_tipo_recurso
            }});
       

        if(tipo_recurso != null)
        {
            if(recurso.length != 0)
            {

                let recurso_tipo_recurso = await Entity.tbl_n_recurso.findAll({
                    where:{
                        ID_TIPO_RECURSO: id_tipo_recurso
                    }
                });

                console.log("LOS RECURSOS ACCT: ", recurso_tipo_recurso);
                console.log("LOS QUE LLEGAN: ", recurso);

                //actualizandoo roles antiguos.
                recurso_tipo_recurso.map(async recurso_it =>{

                    //buscando entre los marcados en la actualización.
                    let busqueda = recurso.filter(recurso_iter => recurso_iter.id_tipo_recurso == recurso_it.ID_RECURSO);

                    if(busqueda.length != 0)
                    {
                        console.log("ENCONTRO: ", recurso_it.ID_RECURSO);
                        let resultado = await Entity.tbl_n_recurso.update({
                            RECURSO_ACTIVO: true
                        },{
                            where:{
                                ID_TIPO_RECURSO: id_tipo_recurso,
                                ID_RECURSO: recurso_it.ID_RECURSO
                            }
                        });

                    }
                    else{
                        console.log("no ENCONTRO: ", recurso_it.ID_RECURSO);
                        let resultado = await Entity.tbl_n_recurso.update({
                            RECURSO_ACTIVO: false
                        },{
                            where:{
                                ID_TIPO_RECURSO: id_tipo_recurso,
                                ID_RECURSO: recurso_it.ID_RECURSO
                            }
                        });

                    }
                });

                for(let recurso_it of recurso)
                {
                    let  id_tipo_recurso  = recurso_it.id_tipo_recurso;

                    let recurso_pivote = await Entity.tbl_n_tipo_recurso.findByPk(id_tipo_recurso);

                    let recurso_existente = await Entity.tbl_n_recurso.findAll({
                        where:{
                           // ID_RECURSO: id_tipo_recurso_recurso,
                            ID_TIPO_RECURSO: id_tipo_recurso
                        }
                    })

                    if(tipo_recurso_existente.length == 0)
                    {
                        console.log("CREO EL ROL: ", id_tipo_recurso_recurso)
                        let recurso_creado = await Entity.tbl_n_recurso.create({
                            //ID_RECURSO: id_tipo_recurso_recurso,
                            ID_TIPO_RECURSO: id_tipo_recurso,
                           
                        });
                    }

                }
            }

            res.status(200).send({message:"OK"});
            }   
        
        else{
            res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."});
        }


    }catch(e)
    {
        console.log(e);
        res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."});
    }

}

module.exports={
    tiporecurso_registrados,
    cambiar_estado_tiporecurso,
    //tipo_recurso_recurso,    
    crear_tipo_recurso,
    actualizar_tipo_recurso
}