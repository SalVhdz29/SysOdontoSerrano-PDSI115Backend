'use strict'
// importamos mediante require modelos y librerias necesarias.

//Conexión a BD.
const {sequelize} = require('../models/index.js');
//importamos modelo para usuarios.
let init_models= require("../models/init-models");

var Entity= init_models(sequelize); // inicialización de los modelos.

//Servicios
const auth_service = require("../services/auth_service");

//obtiene la lista de usuarios registrados de tipo usuario.
const usuarios_registrados = async(req, res)=>{

    try{

        //variables de Output.
        let lista_usuarios =[];

        const usuarios_registrados = await Entity.tbl_n_usuario.findAll({
            where:{
                ID_TIPO_USUARIO: 1
            }
        });

        const usuarios_roles = await Entity.tbl_n_usuario.findAll({
            where:{
                ID_TIPO_USUARIO: 2
            }
        });

        const empleados_registrados = await Entity.tbl_n_empleado.findAll({});



        if(usuarios_registrados.length !=0)
        {
            console.log("ENTRAMOS EN USUARIOS_REGISTRADOS");
            //usuarios_registrados.map(async usuario_r_it =>{
            for(let usuario_r_it of usuarios_registrados){

                let { ID_USUARIO,
                     ID_EMPLEADO,
                     NOMBRE_USUARIO,
                    CORREO_ELECTRONICO_USUARIO,
                    FECHA_CREACION_USUARIO,
                    USUARIO_ACTIVO
                    } = usuario_r_it;

                console.log("EL NOMBRE: ", NOMBRE_USUARIO);

                let id_usuario = ID_USUARIO;
                let nombre_usuario = NOMBRE_USUARIO;
                let id_f_empleado = ID_EMPLEADO;
                let fecha_creacion = FECHA_CREACION_USUARIO;
                let usuario_activo = USUARIO_ACTIVO;
                let correo_electronico = CORREO_ELECTRONICO_USUARIO;

                let id_persona = 0;
                let nombre_empleado = "Sin empleado.";

                let roles = [];


                let empleado_correspondiente = empleados_registrados.filter(emp_it => emp_it.ID_EMPLEADO == ID_EMPLEADO );

                if(empleado_correspondiente.length != 0)
                {
                    id_persona = empleado_correspondiente.ID_PERSONA;

                    const persona = await Entity.tbl_n_persona.findByPk(id_persona);

                    nombre_empleado = persona.NOMBRE_PERSONA + " " + persona.APELLIDO_PERSONA;
                    
                }

                let roles_usuario = await Entity.tbl_n_rol.findAll({
                    where:{
                        ID_USUARIO: id_usuario,
                        ROL_USUARIO_ACTIVO: true
                    }
                });

                if(roles_usuario.length != 0)
                {
                    roles_usuario.map(rol_it =>{
                        let usuario_rol = usuarios_roles.filter(usuario_ro_it => usuario_ro_it == rol_it.ID_ROL);

                        let { id_usuario, nombre_usuario } = usuario_rol[0];

                        let rol_pivote = {id_usuario, nombre_usuario};

                        roles.push(rol_pivote);

                    });
                }
                
                let usuario_pivote = {id_usuario,
                                      nombre_usuario,
                                      id_f_empleado,
                                      roles,
                                      nombre_empleado,
                                      correo_electronico,
                                      fecha_creacion,
                                      usuario_activo
                                     };

                console.log("USUARIO_PIVOTE: ", usuario_pivote);

                lista_usuarios.push(usuario_pivote);

            } // fin for usuarios_registrados.
        }
        res.status(200).send(lista_usuarios);

    }
    catch(e)
    {
        console.log>("EL ERROR: ==> ",e);
        res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."});
    }
}

module.exports={
    usuarios_registrados
}