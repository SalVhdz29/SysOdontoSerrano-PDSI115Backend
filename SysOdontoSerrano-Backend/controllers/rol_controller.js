'use strict' 
// importamos mediante require modelos y librerias necesarias. 
 
//Conexión a BD. 
const {sequelize} = require('../models/index.js'); 
//importamos modelo para roles. 
let init_models= require("../models/init-models"); 
 
var Entity= init_models(sequelize); // inicialización de los modelos. 
const { DateTime } = require("luxon"); 

//Servicios 
const auth_service = require("../services/auth_service"); 
 
//obtiene la lista de roles registrados de tipo rol. 
const roles_registrados = async(req, res)=>{ 
 
    try{ 
 
        //variables de Output. 
        let lista_roles =[]; 
 
        const roles_registrados = await Entity.tbl_n_usuario.findAll({ 
            where:{ 
                ID_TIPO_USUARIO: 2 
            } 
        }); 
 
        if(roles_registrados.length !=0) 
        { 
           // console.log("ENTRAMOS EN ROLES_REGISTRADOS"); 

           // console.log("ROLES REGISTRADOS: ", roles_registrados); 
            for(let rol_r_it of roles_registrados){ 
                 

                   let { ID_USUARIO,  
                    NOMBRE_USUARIO,  
                   FECHA_CREACION_USUARIO,
                   USUARIO_ACTIVO,
                   DESCRIPCION_USUARIO
                   } = rol_r_it;

              // console.log("EL NOMBRE: ", NOMBRE_USUARIO); 

               let id_rol = ID_USUARIO; 
               let nombre_rol = NOMBRE_USUARIO; 
               let fecha_rol = FECHA_CREACION_USUARIO;
               let rol_activo = USUARIO_ACTIVO;
               let descripcion = DESCRIPCION_USUARIO


               let permisos = []; 

               let permisos_rol = await Entity.permiso.findAll({ 
                   where:{ 
                       ID_USUARIO: id_rol, 
                       PERMISO_ACTIVO: true 
                   } 
               }); 

              // console.log("PERMISOS ENCONTRADOS: ", permisos_rol); 
               if(permisos_rol.length != 0) 
               { 
                   for(let permiso_it of permisos_rol){

                    
                       let {ID_RECURSO } = permiso_it;


                       let recurso = await Entity.tbl_n_recurso.findAll({
                           where:{
                            ID_RECURSO : ID_RECURSO
                           }
                       })

                       let nombre_recurso = "";
                     //  console.log("RECURSO [0]: ", recurso[0]);
                       recurso = recurso[0];
                       
                       if(recurso != null){
                        let {NOMBRE_RECURSO} = recurso;
                        nombre_recurso = NOMBRE_RECURSO;
                       }
                       
                      let id_rol = ID_RECURSO;
                      let nombre_rol = nombre_recurso;
                       let permiso_pivote = {id_rol, nombre_rol}; 

                       permisos.push(permiso_pivote); 
                    }
               } 
            //    console.log("LOS PERMISOS SON: ", permisos);

                                    let rol_pivote = {id_rol, 
                                        nombre_rol,   
                                        fecha_rol,
                                        rol_activo,
                                        permisos,
                                        descripcion 
                                       };

             //  console.log("ROL_PIVOTE: ", rol_pivote); 

               lista_roles.push(rol_pivote); 

           } // fin for roles_registrados. 
       } 
       console.log("")
       res.status(200).send(lista_roles); 

   } 
   catch(e) 
   { 
       //console.log>("EL ERROR: ==> ",e); 
       res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."}); 
   } 
} 

//actualiza el valor de activo de un rol registrado. 
const cambiar_estado_rol = async(req, res) =>{ 
 
    try{ 
 
        let { id_rol } = req.body; 

        let rol = await Entity.tbl_n_usuario.findByPk(id_rol); 
 
        let rol_activo = rol.USUARIO_ACTIVO; 
 
        await Entity.tbl_n_usuario.update({ USUARIO_ACTIVO: !rol_activo },{ 
            where: { 
                ID_USUARIO: id_rol 
            } 
        }); 
 
        res.status(200).send({message:"OK"}); 
        
 
    }catch(e) 
    { 
       // console.log>("EL ERROR: ==> ",e); 
        res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."}); 
    } 
} 

//obtener permisos de rol
const rol_permisos = async(req, res) =>{ 
    try{ 
 
        let lista_permisos =[]; 
        //obteniendo permisos del rol 
        const recursos = await Entity.tbl_n_recurso.findAll({ 
            where:{ 
                RECURSO_ACTIVO: true 
            } 
        }); 
        if(recursos.length) 
        { 
            for(let permiso_it of recursos ) 
            { 
                 
     
                let nombre_rol = permiso_it.NOMBRE_RECURSO; 
     
                let id_rol = permiso_it.ID_RECURSO; 
     
               // let id_tipo_recurso = permiso.it.ID_TIPO_RECURSO;
                let permiso_pivote={id_rol, nombre_rol/*, id_tipo_recurso*/}; 
     
                lista_permisos.push(permiso_pivote); 
            } 
 
        } 
 
        res.status(200).send(lista_permisos); 
 
    } 
    catch(e) 
    { 
        console.log(e); 
        res.status(500).send({errorMessage:"Excepción del servidor."}) 
    } 
}

//creacion de un nuevo rol. 
const crear_rol = async(req, res) =>{ 
 
    try{ 
 
        let { 
            nombre_rol, 
            descripcion_rol, 
            rol_activo, 
            permisos, 
        } = req.body; 
 
       console.log("lo obtenido: ", req.body); 
        let fecha_hoy = DateTime.now(); 
 
        let tipo_usuario = await Entity.tbl_n_tipo_usuario.findByPk(2); 
        console.log("EL TIPO USUARIO: ", tipo_usuario.ID_TIPO_USUARIO);
 
        //creando nuevo rol. 
    
        let nuevo_usuario_rol = await Entity.tbl_n_usuario.create({ 
            NOMBRE_USUARIO: nombre_rol,  
            USUARIO_ACTIVO: rol_activo, 
            FECHA_CREACION_USUARIO: fecha_hoy, 
            FECHA_MODIFICACION_USUARIO: fecha_hoy, 
            ID_TIPO_USUARIO: tipo_usuario.ID_TIPO_USUARIO,
            CORREO_ELECTRONICO_USUARIO: "*_____________*",
            CONTRASENIA_USUARIO: "usuarioRol",
            DESCRIPCION_USUARIO: descripcion_rol
        }); 
  

     
 
        let id_usuario_creado = nuevo_usuario_rol.ID_USUARIO; 
        console.log("ID_USUARIO_CREADO: ", id_usuario_creado); 
 
        //relacionando permisos con el rol. 
 
        if(permisos.length != 0) 
        { 
 
                for(let permiso_it of permisos) 
                { 
                    let { id_rol } = permiso_it; 
 
                    let permiso_pivote = await Entity.tbl_n_recurso.findByPk(id_rol); 
                    if(permiso_pivote != null){
                    let permiso_creado = await Entity.permiso.create({ 
                        ID_RECURSO: permiso_pivote.ID_RECURSO, 
                        ID_USUARIO: id_usuario_creado, 
                        PERMISO_ACTIVO: true 
                    }); }
 
                } 
        } 
        console.log("LLEGO AL FINAL");
        res.status(200).send({message:"OK"}); 
 
    }catch(e) 
    { 
        console.log("EL ERROR: ",e); 
        res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."}); 
    } 
}

//actualizar datos de rol. 
 
const actualizar_rol =async(req, res) =>{ 
 
    try{ 
 
        let { 
            id_rol, 
            nombre_rol, 
            descripcion, 
            rol_activo, 
            permisos, 
        } = req.body; 
 
        //console.log("LO OBTENIDO: ", req.body); 
 
        let fecha_hoy = DateTime.now(); 
        let rol=null; 

        //actualización de rol. 

            rol = await Entity.tbl_n_usuario.update({ 
                NOMBRE_USUARIO: nombre_rol, 
                USUARIO_ACTIVO: rol_activo, 
                FECHA_MODIFICACION_USUARIO: fecha_hoy 
            },{where:{ 
                ID_USUARIO: id_rol
            }});  
 
        if(rol != null) 
        { 
            if(permisos.length != 0) 
            { 
 
                let permisos_rol = await Entity.permiso.findAll({ 
                    where:{ 
                        ID_USUARIO: id_rol
                    } 
                }); 
 
               // console.log("LOS PERMISOS ACCT: ", permisos_rol); 
               // console.log("LOS QUE LLEGAN: ", permisos); 
 
                //actualizandoo permisos antiguos. 
                permisos_rol.map(async permiso_it =>{ 
 
                    //buscando entre los marcados en la actualización. 
                    let busqueda = permisos.filter(permiso_iter => permiso_iter.id_rol == permiso_it.ID_RECURSO); 
 
                    if(busqueda.length != 0) 
                    { 
                     //   console.log("ENCONTRO: ", permiso_it.ID_RECURSO); 
                        let resultado = await Entity.permiso.update({ 
                            PERMISO_ACTIVO: true 
                        },{ 
                            where:{ 
                                ID_USUARIO: id_rol, 
                                ID_RECURSO: permiso_it.ID_RECURSO
                            } 
                        }); 
 
                    } 
                    else{ 
                       // console.log("NO ENCONTRO: ", permiso_it.ID_RECURSO); 
                        let resultado = await Entity.permiso.update({ 
                            PERMISO_ACTIVO: false 
                        },{ 
                            where:{ 
                                ID_USUARIO: id_rol, 
                                ID_RECURSO: permiso_it.ID_RECURSO
                            } 
                        }); 
 
                    } 
                }); 
 
                for(let permiso_it of permisos) 
                { 
                    let  id_rol_permiso  = permiso_it.id_rol; 
 
                    let permiso_pivote = await Entity.tbl_n_recurso.findByPk(id_rol_permiso); 
 
                    let permiso_existente = await Entity.permiso.findAll({ 
                        where:{ 
                            ID_RECURSO: id_rol_permiso, 
                            ID_USUARIO: id_rol 
                        } 
                    }) 
 
                    if(permiso_existente.length == 0) 
                    { 
                     //   console.log("CREO EL PERMISO: ", id_rol_permiso) 
                        let permiso_creado = await Entity.permiso.create({ 
                            ID_RECURSO: id_rol_permiso, 
                            ID_USUARIO: id_rol, 
                            PERMISO_ACTIVO: true 
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
   roles_registrados, 
   cambiar_estado_rol, 
   rol_permisos,  
   crear_rol, 
   actualizar_rol 
}