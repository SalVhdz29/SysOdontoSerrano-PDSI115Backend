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
 
        const roles_registrados = await Entity.tbl_n_rol.findAll({ 
            where:{ 
                ID_TIPO_ROL: 1 
            } 
        }); 
 
        const roles_permisos = await Entity.tbl_n_rol.findAll({ 
            where:{ 
                ID_TIPO_ROL: 2,
                ROL_ACTIVO: true 
            } 
        }); 
 
 
 
 
        if(roles_registrados.length !=0) 
        { 
            console.log("ENTRAMOS EN ROLES_REGISTRADOS"); 
            //roles_registrados.map(async rol_r_it =>{ 
            console.log("ROLES REGISTRADOS: ", roles_registrados); 
            for(let rol_r_it of roles_registrados){ 
                 
                let { ID_ROL,  
                    NOMBRE_ROL, 
                   DESCRIPCION_ROL, 
                   FECHA_ROL, 
                   ROL_ACTIVO 
                   } = rol_r_it; 

               console.log("EL NOMBRE: ", NOMBRE_ROL); 

               let id_rol = ID_ROL; 
               let nombre_rol = NOMBRE_ROL; 
               let fecha_rol = FECHA_ROL; 
               let rol_activo = ROL_ACTIVO; 
               let descripcion = DESCRIPCION_ROL; 


               let permisos = []; 

               let permisos_rol = await Entity.tbl_n_permiso.findAll({ 
                   where:{ 
                       ID_ROL: id_rol, 
                       PERMISO_ROL_ACTIVO: true 
                   } 
               }); 

               console.log("PERMISOS ENCONTRADOS: ", permisos_rol); 
               if(permisos_rol.length != 0) 
               { 
                   permisos_rol.map(permiso_it =>{ 
                       let rol_permiso = roles_permisos.filter(rol_ro_it => rol_ro_it.ID_ROL == permiso_it.ID_PERMISO); 

                       console.log("LO QUE FILTRO: ", rol_permiso);

                       let { ID_ROL, NOMBRE_ROL } = rol_permiso[0];
                       let id_rol = ID_ROL; 
                       let nombre_rol = NOMBRE_ROL; 

                       let permiso_pivote = {id_rol, nombre_rol}; 

                       permisos.push(permiso_pivote); 

                   }); 
               } 
                
               let rol_pivote = {id_rol, 
                                     nombre_rol, 
                                     permisos, 
                                     descripcion, 
                                     fecha_rol, 
                                     rol_activo 
                                    }; 

               console.log("ROL_PIVOTE: ", rol_pivote); 

               lista_roles.push(rol_pivote); 

           } // fin for roles_registrados. 
       } 
       res.status(200).send(lista_roles); 

   } 
   catch(e) 
   { 
       console.log>("EL ERROR: ==> ",e); 
       res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."}); 
   } 
} 

//actualiza el valor de activo de un rol registrado. 
const cambiar_estado_rol = async(req, res) =>{ 
 
    try{ 
 
        let { id_rol } = req.body; 

        let rol = await Entity.tbl_n_rol.findByPk(id_rol); 
 
        let rol_activo = rol.ROL_ACTIVO; 
 
        await Entity.tbl_n_rol.update({ ROL_ACTIVO: !rol_activo },{ 
            where: { 
                ID_ROL: id_rol 
            } 
        }); 
 
        res.status(200).send({message:"OK"}); 
        
 
    }catch(e) 
    { 
        console.log>("EL ERROR: ==> ",e); 
        res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."}); 
    } 
} 

//obtener rol permisos 
const rol_permisos = async(req, res) =>{ 
    try{ 
 
        let lista_permisos =[]; 
        //obteniendo roles de tipo rol permiso. 
        const roles_permisos = await Entity.tbl_n_rol.findAll({ 
            where:{ 
                ID_TIPO_ROL: 2, 
                ROL_ACTIVO: true 
            } 
        }); 
        if(rol_permisos.length) 
        { 
            for(let permiso_it of roles_permisos ) 
            { 
                 
     
                let nombre_rol = permiso_it.NOMBRE_ROL; 
     
                let id_rol = permiso_it.ID_ROL; 
     
                let permiso_pivote={id_rol, nombre_rol}; 
     
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
            descripcion, 
            rol_activo, 
            permisos, 
        } = req.body; 
 
        console.log("lo obtenido: ", req.body); 
        let fecha_hoy = DateTime.now(); 
 
        let tipo_rol = await Entity.tbl_n_tipo_rol.findByPk(1); 
 
        //creando nuevo rol. 
        let nuevo_rol = await Entity.tbl_n_rol.create({ 
            NOMBRE_ROL: nombre_rol, 
            DESCRIPCION_ROL: descripcion, 
            ROL_ACTIVO: rol_activo, 
            FECHA_ROL: fecha_hoy, 
            FECHA_MODIFICACION_ROL: fecha_hoy, 
            ID_TIPO_ROL: tipo_rol.ID_TIPO_ROL 
        }); 
 
        let id_rol_creado = nuevo_rol.ID_ROL; 
        console.log("ID_ROL: ", id_rol_creado); 
 
        //relacionando permisos con el rol. 
 
        if(permisos.length != 0) 
        { 
 
                for(let permiso_it of permisos) 
                { 
                    let { id_rol } = permiso_it; 
 
                    let permiso_pivote = await Entity.tbl_n_rol.findByPk(id_rol); 
 
                    let permiso_creado = await Entity.tbl_n_permiso.create({ 
                        ID_PERMISO: permiso_pivote.ID_ROL, 
                        ID_ROL: id_rol_creado, 
                        PERMISO_ROL_ACTIVO: true 
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
 
        console.log("LO OBTENIDO: ", req.body); 
 
        let fecha_hoy = DateTime.now(); 
        let rol=null; 

        //actualización de rol. 

            rol = await Entity.tbl_n_rol.update({ 
                NOMBRE_ROL: nombre_rol, 
                DESCRIPCION_ROL: descripcion, 
                ROL_ACTIVO: rol_activo, 
                FECHA_MODIFICACION_ROL: fecha_hoy 
            },{where:{ 
                ID_ROL: id_rol
            }});  
 
        if(rol != null) 
        { 
            if(permisos.length != 0) 
            { 
 
                let permisos_rol = await Entity.tbl_n_permiso.findAll({ 
                    where:{ 
                        ID_ROL: id_rol
                    } 
                }); 
 
                console.log("LOS PERMISOS ACCT: ", permisos_rol); 
                console.log("LOS QUE LLEGAN: ", permisos); 
 
                //actualizandoo permisos antiguos. 
                permisos_rol.map(async permiso_it =>{ 
 
                    //buscando entre los marcados en la actualización. 
                    let busqueda = permisos.filter(permiso_iter => permiso_iter.id_rol == permiso_it.ID_PERMISO); 
 
                    if(busqueda.length != 0) 
                    { 
                        console.log("ENCONTRO: ", permiso_it.ID_PERMISO); 
                        let resultado = await Entity.tbl_n_permiso.update({ 
                            PERMISO_ROL_ACTIVO: true 
                        },{ 
                            where:{ 
                                ID_ROL: id_rol, 
                                ID_PERMISO: permiso_it.ID_PERMISO 
                            } 
                        }); 
 
                    } 
                    else{ 
                        console.log("NO ENCONTRO: ", permiso_it.ID_PERMISO); 
                        let resultado = await Entity.tbl_n_permiso.update({ 
                            PERMISO_ROL_ACTIVO: false 
                        },{ 
                            where:{ 
                                ID_ROL: id_rol, 
                                ID_PERMISO: permiso_it.ID_PERMISO 
                            } 
                        }); 
 
                    } 
                }); 
 
                for(let permiso_it of permisos) 
                { 
                    let  id_rol_permiso  = permiso_it.id_rol; 
 
                    let permiso_pivote = await Entity.tbl_n_rol.findByPk(id_rol); 
 
                    let permiso_existente = await Entity.tbl_n_permiso.findAll({ 
                        where:{ 
                            ID_PERMISO: id_rol_permiso, 
                            ID_ROL: id_rol 
                        } 
                    }) 
 
                    if(permiso_existente.length == 0) 
                    { 
                        console.log("CREO EL PERMISO: ", id_rol_permiso) 
                        let permiso_creado = await Entity.tbl_n_permiso.create({ 
                            ID_PERMISO: id_rol_permiso, 
                            ID_ROL: id_rol, 
                            PERMISO_ROL_ACTIVO: true 
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