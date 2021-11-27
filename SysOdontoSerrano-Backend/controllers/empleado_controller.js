'use strict'
// importamos mediante require modelos y librerias necesarias.

//Conexión a BD.
const {sequelize} = require('../models/index.js');
//importamos modelo para usuarios.
let init_models= require("../models/init-models");

var Entity= init_models(sequelize); // inicialización de los modelos.
const { DateTime } = require("luxon");

const obtener_empleados_todos=async(req, res)=>{

    try{

        const empleados_registrados = await Entity.tbl_n_empleado.findAll({});
        const usuarios_roles = await Entity.tbl_n_usuario.findAll({
            where:{
                ID_TIPO_USUARIO: 2,
                USUARIO_ACTIVO: true
            }
        });

        let lista_empleados =[];

        for(let iterador_empleado of empleados_registrados)
        {
            if(iterador_empleado != null)
            {
                let id_empleado = iterador_empleado.ID_EMPLEADO;
                let id_persona = iterador_empleado.ID_PERSONA;

                let persona_correspondiente = await Entity.tbl_n_persona.findByPk(id_persona);

                let nombre_empleado = persona_correspondiente.NOMBRE_PERSONA + " " + persona_correspondiente.APELLIDO_PERSONA;

                let nombres_empleado = persona_correspondiente.NOMBRE_PERSONA;

                let apellidos_empleado = persona_correspondiente.APELLIDO_PERSONA;

                let fecha_nacimiento = persona_correspondiente.FECHA_NACIMIENTO;

                let fecha_ingreso = iterador_empleado.FECHA_INGRESO;

                let salario = iterador_empleado.SALARIO;

                let empleado_activo = iterador_empleado.EMPLEADO_ACTIVO;


                let detalle_persona_correspondiente = await Entity.tbl_n_detalle_persona.findAll({
                    where:{
                        ID_PERSONA: id_persona
                    }
                });

                console.log("DETALLE: ", detalle_persona_correspondiente[0])

                let telefono_contacto =""
                let dui=""
                let direccion=""

                if(detalle_persona_correspondiente[0] != null)
                {
                    let{
                        NUMERO_DE_CONTACTO,
                        DUI,
                        DIRECCION
                    } = detalle_persona_correspondiente[0];
    
                     telefono_contacto= NUMERO_DE_CONTACTO;
                    
                     dui = DUI;
    
                     direccion = DIRECCION;
                }




                //usuario

                let usuario_correspondiente = await Entity.tbl_n_usuario.findAll({
                    where:{
                        ID_EMPLEADO: id_empleado
                    }
                });

                let usuario_nombre = "";
                let usuario_roles =[];

                let con_usuario = false;

                if(usuario_correspondiente != null && usuario_correspondiente.length >0)
                {
                    con_usuario = true;
                    usuario_nombre = usuario_correspondiente[0].NOMBRE_USUARIO;

                    let id_usuario = usuario_correspondiente[0].ID_USUARIO;
                    
                    let roles_usuario = await Entity.tbl_n_rol.findAll({
                        where:{
                            ID_USUARIO: id_usuario,
                            ROL_USUARIO_ACTIVO: true
                        }
                    });
           

                    if(roles_usuario.length != 0)
                    {
                        roles_usuario.map(rol_it =>{
                            let usuario_rol = usuarios_roles.filter(usuario_ro_it => usuario_ro_it.ID_USUARIO == rol_it.ID_ROL);

                        

                            let { ID_USUARIO, NOMBRE_USUARIO } = usuario_rol[0];

                            let id_usuario = ID_USUARIO;
                            let nombre_usuario = NOMBRE_USUARIO;

                            let rol_pivote = {id_usuario, nombre_usuario};

                            usuario_roles.push(rol_pivote);

                        });
                    }
                }

                let n_empleado ={
                    id_empleado,
                    nombre_empleado,
                    nombres_empleado,
                    apellidos_empleado,
                    usuario_nombre,
                    usuario_roles,
                    con_usuario,
                    fecha_ingreso,
                    fecha_nacimiento,
                    salario_empleado: salario,
                    empleado_activo,
                    telefono_contacto,
                    dui_empleado: dui, direccion_empleado: direccion
                }

                lista_empleados.push(n_empleado);
            }
        }

        res.status(200).send(lista_empleados);

    }catch(e)
    {
        console.log("EL ERROR ====>: ",e);
        res.status(500).send({errorMessage:  "Ha ocurrido un error en el servidor."});
    }
}


const cambiar_estado_empleado=async(req, res)=>{

    try{

        
        let { id_empleado } = req.body;

        let empleado = await Entity.tbl_n_empleado.findByPk(id_empleado);

        let estado_activo = empleado.EMPLEADO_ACTIVO;

        await Entity.tbl_n_empleado.update({ EMPLEADO_ACTIVO: !estado_activo },{
            where: {
                ID_EMPLEADO: id_empleado
            }
        });

        res.status(200).send({message:"OK"});


    }catch(e)
    {
        console.log("EL ERROR ====>: ",e);
        res.status(500).send({errorMessage:  "Ha ocurrido un error en el servidor."});
    }
}

const guardar_nuevo_empleado =async(req, res)=>{
    try{

        let { 
            nombres_empleado,
            apellidos_empleado,
            fecha_ingreso,
            fecha_nacimiento,
            telefono_contacto,
            direccion_empleado,
            dui_empleado,
            salario_empleado
        } = req.body;

        let persona = await Entity.tbl_n_persona.create({
            NOMBRE_PERSONA: nombres_empleado,
            APELLIDO_PERSONA: apellidos_empleado,
            FECHA_NACIMIENTO: fecha_nacimiento
        });

        let detalle_persona = await Entity.tbl_n_detalle_persona.create({
            ID_PERSONA: persona.ID_PERSONA,
            NUMERO_DE_CONTACTO: telefono_contacto,
            DUI: dui_empleado,
            DIRECCION: direccion_empleado
        })

        let nuevo_empleado = await Entity.tbl_n_empleado.create({
            ID_PERSONA: persona.ID_PERSONA,
            FECHA_INGRESO: fecha_ingreso,
            SALARIO: salario_empleado,
            EMPLEADO_ACTIVO: true,
            FECHA_BAJA: fecha_ingreso
        })

        res.status(200).send({message:"OK"});

    }catch(e)
    {
        console.log("EL ERROR ====>: ",e);
        res.status(500).send({errorMessage:  "Ha ocurrido un error en el servidor."});
    }
}

const actualizar_datos_empleado = async(req, res)=>{
    try{

        let {
            id_empleado,
            nombres_empleado,
            apellidos_empleado,
            fecha_ingreso,
            telefono_contacto,
            direccion_empleado,
            dui_empleado,
            salario_empleado
        } = req.body;


        let empleado = await Entity.tbl_n_empleado.findByPk(id_empleado);

        let{
            ID_PERSONA 
        } = empleado;

        let id_persona = ID_PERSONA;

        await Entity.tbl_n_empleado.update({
            FECHA_INGRESO: fecha_ingreso,
            SALARIO: salario_empleado,

        },{
            where:{
                ID_EMPLEADO: id_empleado
            }
        });

        await Entity.tbl_n_persona.update({
            NOMBRE_PERSONA: nombres_empleado,
            APELLIDO_PERSONA: apellidos_empleado
        },{
            where:{
                ID_PERSONA: id_persona
            }
        });

        await Entity.tbl_n_detalle_persona.update({
            NUMERO_DE_CONTACTO: telefono_contacto,
            DUI: dui_empleado,
            DIRECCION: direccion_empleado
        },{
            where:{
                ID_PERSONA: id_persona
            }
        })

        res.status(200).send({message:"OK"});


    }catch(e)
    {
        console.log("EL ERROR ====>: ",e);
        res.status(500).send({errorMessage:  "Ha ocurrido un error en el servidor."});
    }
}

module.exports={
    obtener_empleados_todos,
    cambiar_estado_empleado,
    guardar_nuevo_empleado,
    actualizar_datos_empleado
}