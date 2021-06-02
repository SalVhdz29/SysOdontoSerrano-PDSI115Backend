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
    let autorizado_servicio = auth_service._autorización_Recurso(1);
    if(autorizado_servicio)
    {

   
            console.log("req====>", req);
            let id_usuario = req.user;
            console.log("IO",id_usuario);
            let id_roles =[];
            

            const usuario = await Entity.tbl_n_usuario.findByPk(id_usuario);
            console.log("USUARIO", usuario);

            const roles = await Entity.tbl_n_rol.findAll({
                where:{
                    ID_USUARIO: usuario.ID_USUARIO
                }
            });

            console.log(roles);

            //obteniendo el id de los roles del usuario. se hace con for en vez de map porque map no respeta el async await.
            for (let rol of roles) {
                let usuario_rol = await _rol_busqueda(rol.ID_F_USUARIO_ROL)
                id_roles.push(usuario_rol.ID_USUARIO);

                
            }
        
            
            console.log("LOS ROLES ===>: ", id_roles);

            res.status(200).send({
                id_usuario: usuario.ID_USUARIO,
                nombre_usuario: usuario.NOMBRE_USUARIO,
                correo_electronico_usuario: usuario.CORREO_ELECTRONICO_USUARIO,
                roles_usuario: id_roles,
                


            });

        }
    }
    catch(e)
    {
        console.log(e);
    }

}

const signIn = async(req, res) =>{
    let { correo_electronico, contrasenia} = req.body;
    console.log(correo_electronico, "y: ",contrasenia);
    try{
        const usuario = await Entity.tbl_n_usuario.findOne({
            where:{
                CORREO_ELECTRONICO_USUARIO: correo_electronico,
                USUARIO_ACTIVO: true
            }
        });
        console.log("Usuario", usuario);
        if(usuario != null)
        {
            //VERIFICANDO LA CONTRASEÑA

            let valida =await usuario.validPassword(contrasenia);
            console.log("valido: ",valida);

            if(valida)
            {
                console.log(auth_service)
    
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