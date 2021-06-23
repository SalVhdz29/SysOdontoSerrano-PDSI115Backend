'use strict'

//Conexión a BD.
const {sequelize} = require('../models/index.js');
//importamos modelo para usuarios.
let init_models= require("../models/init-models");

var Entity= init_models(sequelize); // inicialización de los modelos.

//Servicios
const auth_service = require("../services/auth_service");

const signUp = (req, res)=>{

    // const user = new User({
    //     email: req.body.email,
    //     displayName: req.body.displayName //contraseña.
    // });

    // user.save((err)=>{
    //     if(err) res.status(500).send({message:`Error al crear el usuario ${err}`});
    //     return res.status(200).send({ token: auth_service.createToken})
    // })
}

const usuario_registrado=async (req,res)=>{
    try{
 

   
            // console.log("req====>", req);
            let id_usuario = req.user;
            // console.log("IO",id_usuario);
            let id_roles =[];
            

            const usuario = await Entity.tbl_n_usuario.findByPk(id_usuario);
            // console.log("USUARIO", usuario);

            const roles = await Entity.tbl_n_rol.findAll({
                where:{
                    ID_USUARIO: usuario.ID_USUARIO,
                    ROL_USUARIO_ACTIVO: true
                }
            });

            //console.log(roles);
            let permisos=[];

            let tipos_recurso =[];

            let recursos_permiso = [];
            
            for (let rol of roles) {


                let permisos = await Entity.permiso.findAll({
                    
                        where:{
                            ID_USUARIO: rol.ID_ROL,
                            PERMISO_ACTIVO: true
                        }          
                });
                for(let permiso_it of permisos)
                {
                    let recurso = await Entity.tbl_n_recurso.findByPk(permiso_it.ID_RECURSO);
                  
                    if(recurso)
                    {
                        recursos_permiso.push(recurso);
                        let tipo_recurso = await Entity.tbl_n_tipo_recurso.findByPk(recurso.ID_TIPO_RECURSO);
                       // console.log("TIPO RECURSO IT: ", tipo_recurso.ID_TIPO_RECURSO)
                        if(tipo_recurso)
                        {
                            let coincidencias = tipos_recurso.filter(tipo_it => tipo_it.ID_TIPO_RECURSO == tipo_recurso.ID_TIPO_RECURSO);
                           // console.log("COINCIDENCIAS : ", coincidencias.length);
                            if(coincidencias.length == 0)
                            {
                                tipos_recurso.push(tipo_recurso);
                            }
                        }
                    }
                }
                
                
            }
            //console.log("TIPOS RECURSO: ", tipos_recurso);
            for(let tipo_recurso_it of tipos_recurso)
            {
                let nombre_modulo = tipo_recurso_it.NOMBRE_TIPO_RECURSO;

                let recursos =[];

                let filtrados = recursos_permiso.filter(recurso_it => recurso_it.ID_TIPO_RECURSO == tipo_recurso_it.ID_TIPO_RECURSO);

                if(filtrados.length != 0)
                {
                    for(let iterador of filtrados)
                    {
                        let recurso = iterador;

                        let ruta = recurso.RUTA_RECURSO;
                        let id_recurso = recurso.ID_RECURSO;

                        let objeto ={ruta, id_recurso};
                        recursos.push(objeto);
                    }
                }

                let objeto = { nombre_modulo, recursos};

                permisos.push(objeto);


            }
        
            //console.log("PERMISOS ANTES DE ENVIO: ", permisos);
            // console.log("LOS ROLES ===>: ", id_roles);

            

            res.status(200).send({
                id_usuario: usuario.ID_USUARIO,
                nombre_usuario: usuario.NOMBRE_USUARIO,
                correo_electronico_usuario: usuario.CORREO_ELECTRONICO_USUARIO,
                permisos
                


            });

        
    }
    catch(e)
    {
        console.log(e);
    }

}

const signIn = async(req, res) =>{
    let { correo_electronico, contrasenia} = req.body;
    // console.log(correo_electronico, "y: ",contrasenia);
    try{
        const usuario = await Entity.tbl_n_usuario.findOne({
            where:{
                CORREO_ELECTRONICO_USUARIO: correo_electronico,
                USUARIO_ACTIVO: true
            }
        });
        // console.log("Usuario", usuario);
        if(usuario != null)
        {
            //VERIFICANDO LA CONTRASEÑA

            let valida =await usuario.validPassword(contrasenia);
            // console.log("valido: ",valida);

            if(valida)
            {
                // console.log(auth_service)
    
            let token= auth_service.createToken(usuario);
    
            res.status(200).send({token});
            }
            else{
                res.status(401).send({message:"Credenciales no válidas."});
            }
            
        }
        else{
            res.status(401).send({message:"Credenciales no válidas."});
        }

        
    }   
    catch(e)
    {
        console.log(e);
        res.status(500).send({message:"excepción del servidor."});

    }
}

//funcion encargada de buscar un usuario_rol por medio de su ID de usuario
const _rol_busqueda = async rol=>{
    const usuario_rol = await Entity.tbl_n_usuario.findByPk(rol);
    return usuario_rol;
}


module.exports={
    usuario_registrado,
    signIn
}