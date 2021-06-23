'use strict'
// importamos mediante require modelos y librerias necesarias.

//Conexión a BD.
const {sequelize} = require('../models/index.js');
//importamos modelo para usuarios.
let init_models= require("../models/init-models");

var Entity= init_models(sequelize); // inicialización de los modelos.
const { DateTime } = require("luxon");

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
                ID_TIPO_USUARIO: 2,
                USUARIO_ACTIVO: true
            }
        });

        const empleados_registrados = await Entity.tbl_n_empleado.findAll({});



        if(usuarios_registrados.length !=0)
        {
           
            for(let usuario_r_it of usuarios_registrados){

                let { ID_USUARIO,
                     ID_EMPLEADO,
                     NOMBRE_USUARIO,
                    CORREO_ELECTRONICO_USUARIO,
                    FECHA_CREACION_USUARIO,
                    USUARIO_ACTIVO
                    } = usuario_r_it;

               

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
                    id_persona = empleado_correspondiente[0].ID_PERSONA;
                   

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
                        let usuario_rol = usuarios_roles.filter(usuario_ro_it => usuario_ro_it.ID_USUARIO == rol_it.ID_ROL);

                      

                        let { ID_USUARIO, NOMBRE_USUARIO } = usuario_rol[0];

                        let id_usuario = ID_USUARIO;
                        let nombre_usuario = NOMBRE_USUARIO;

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


                lista_usuarios.push(usuario_pivote);

            } // fin for usuarios_registrados.
        }
        res.status(200).send(lista_usuarios);

    }
    catch(e)
    {
        console.log>("EL ERROR: ==> ",e);
        res.status(500).send({errorMessage:  "Ha ocurrido un error en el servidor."});
    }
}


//actualiza el valor de activo de un usuario registrado.
const cambiar_estado_usuario = async(req, res) =>{

    try{

        let { id_usuario } = req.body;

        let  {user}  = req;

        if(id_usuario != user)
        {

       

        let usuario = await Entity.tbl_n_usuario.findByPk(id_usuario);

        let estado_activo = usuario.USUARIO_ACTIVO;

        await Entity.tbl_n_usuario.update({ USUARIO_ACTIVO: !estado_activo },{
            where: {
                ID_USUARIO: id_usuario
            }
        });

        res.status(200).send({message:"OK"});
        }
        else{
           
            res.status(200).send({message:" No puede actualizar el estado en sesion"});
        }

    }catch(e)
    {
        console.log>("EL ERROR: ==> ",e);
        res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."});
    }
}

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

//obtener empleados activos
const lista_empleados_activos = async(req,res)=>{
    try{
        let lista_empleados_activos = [];
        let lista_empleados_usuarios = [];
        let lista_empleados_sin_usuario=[];

        let empleados_activos = await Entity.tbl_n_empleado.findAll({
            where:{
                EMPLEADO_ACTIVO: true
            }
        });

        let usuarios_registrados = await Entity.tbl_n_usuario.findAll({
            where:{
                ID_TIPO_USUARIO: 1
            }
        });

     
        //obteniendo id's de empleados con usuario.
        if(usuarios_registrados.length != 0)
        {
                for(let usuario_r_it of usuarios_registrados)
                {
                    if(usuario_r_it.ID_EMPLEADO != null && usuario_r_it.ID_EMPLEADO != undefined)
                    {
                        lista_empleados_usuarios.push(usuario_r_it.ID_EMPLEADO);
                    }
                }
        }
   

        //filtrando empleados sin usuario.
        if(lista_empleados_usuarios.length != 0)
        {
                for(let empleado_it of empleados_activos)
                {
                    let encontrado = false;
                    for(let empleado_usuario of lista_empleados_usuarios)
                    {
                        if(empleado_it.ID_EMPLEADO == empleado_usuario)
                        {
                            encontrado = true;
                        }
                    }
        
                    if(!encontrado)
                    {
                        lista_empleados_sin_usuario.push(empleado_it);
                    }
                }

        }
        else{
            lista_empleados_sin_usuario = empleados_activos;
        }
       
        if(lista_empleados_sin_usuario.length != 0)
        {
                //armando datos de empleado
                for(let empleado_it of lista_empleados_sin_usuario)
                {
                    let id_empleado = empleado_it.ID_EMPLEADO;

                    let id_persona = empleado_it.ID_PERSONA;

                    let persona = await Entity.tbl_n_persona.findByPk(id_persona);

                    let nombre_empleado = persona.NOMBRE_PERSONA + " " +  persona.APELLIDO_PERSONA+".";

                    let empleado ={id_empleado, nombre_empleado};

                    lista_empleados_activos.push(empleado);
                }
        }
       
      

        res.status(200).send(lista_empleados_activos);

    }
    catch(e)
    {
        console.log(e);
        res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."});
    
    }
}

//creacion de un nuevo usuario.
const crear_usuario = async(req, res) =>{

    try{

        let {
            nombre_usuario,
            correo_electronico,
            contrasenia,
            usuario_activo,
            roles,
            id_f_empleado
        } = req.body;

       
        let fecha_hoy = DateTime.now();

        let tipo_usuario = await Entity.tbl_n_tipo_usuario.findByPk(1);

        //creando nuevo usuario.
        let nuevo_usuario = await Entity.tbl_n_usuario.create({
            NOMBRE_USUARIO: nombre_usuario,
            CORREO_ELECTRONICO_USUARIO: correo_electronico,
            USUARIO_ACTIVO: usuario_activo,
            CONTRASENIA_USUARIO: contrasenia,
            FECHA_CREACION_USUARIO: fecha_hoy,
            FECHA_MODIFICACION_USUARIO: fecha_hoy,
            ID_EMPLEADO: id_f_empleado,
            ID_TIPO_USUARIO: tipo_usuario.ID_TIPO_USUARIO
        });

        let id_usuario_creado = nuevo_usuario.ID_USUARIO;
      

        //relacionando roles con el usuario.

        if(roles.length != 0)
        {

                for(let rol_it of roles)
                {
                    let { id_usuario } = rol_it;

                    let rol_pivote = await Entity.tbl_n_usuario.findByPk(id_usuario);

                    let rol_creado = await Entity.tbl_n_rol.create({
                        ID_ROL: rol_pivote.ID_USUARIO,
                        ID_USUARIO: id_usuario_creado,
                        ROL_USUARIO_ACTIVO: true
                    });

                }
        }

        res.status(200).send({message:"OK"});




    }catch(e)
    {
        console.log(e);
        res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."});
    }
}

//actualizar datos de usuario.

const actualizar_usuario =async(req, res) =>{

    try{

        let {
            id_usuario,
            nombre_usuario,
            correo_electronico,
            contrasenia,
            usuario_activo,
            roles,
            id_f_empleado,
            editar_contrasenia
        } = req.body;

        

        let fecha_hoy = DateTime.now();
        let usuario=null;
        //actualización de usuario.
        if(editar_contrasenia){
            usuario = await Entity.tbl_n_usuario.update({
                NOMBRE_USUARIO: nombre_usuario,
                CORREO_ELECTRONICO_USUARIO: correo_electronico,
                USUARIO_ACTIVO: usuario_activo,
                CONTRASENIA_USUARIO: contrasenia,
                FECHA_MODIFICACION_USUARIO: fecha_hoy
            },{
                individualHooks: true,
                where:{
                ID_USUARIO: id_usuario
            }})
        }
        else{
            usuario = await Entity.tbl_n_usuario.update({
                NOMBRE_USUARIO: nombre_usuario,
                CORREO_ELECTRONICO_USUARIO: correo_electronico,
                USUARIO_ACTIVO: usuario_activo,
                FECHA_MODIFICACION_USUARIO: fecha_hoy
            },{where:{
                ID_USUARIO: id_usuario
            }});
        }

        if(usuario != null)
        {
            if(roles.length != 0)
            {

                let roles_usuario = await Entity.tbl_n_rol.findAll({
                    where:{
                        ID_USUARIO: id_usuario
                    }
                });

              

                //actualizandoo roles antiguos.
                roles_usuario.map(async rol_it =>{

                    //buscando entre los marcados en la actualización.
                    let busqueda = roles.filter(rol_iter => rol_iter.id_usuario == rol_it.ID_ROL);

                    if(busqueda.length != 0)
                    {
                      
                        let resultado = await Entity.tbl_n_rol.update({
                            ROL_USUARIO_ACTIVO: true
                        },{
                            where:{
                                ID_USUARIO: id_usuario,
                                ID_ROL: rol_it.ID_ROL
                            }
                        });

                    }
                    else{
                       
                        let resultado = await Entity.tbl_n_rol.update({
                            ROL_USUARIO_ACTIVO: false
                        },{
                            where:{
                                ID_USUARIO: id_usuario,
                                ID_ROL: rol_it.ID_ROL
                            }
                        });

                    }
                });

                for(let rol_it of roles)
                {
                    let  id_usuario_rol  = rol_it.id_usuario;

                    let rol_pivote = await Entity.tbl_n_usuario.findByPk(id_usuario);

                    let rol_existente = await Entity.tbl_n_rol.findAll({
                        where:{
                            ID_ROL: id_usuario_rol,
                            ID_USUARIO: id_usuario
                        }
                    })

                    if(rol_existente.length == 0)
                    {
                       
                        let rol_creado = await Entity.tbl_n_rol.create({
                            ID_ROL: id_usuario_rol,
                            ID_USUARIO: id_usuario,
                            ROL_USUARIO_ACTIVO: true
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
    usuarios_registrados,
    cambiar_estado_usuario,
    usuario_roles,
    lista_empleados_activos,
    crear_usuario,
    actualizar_usuario
}