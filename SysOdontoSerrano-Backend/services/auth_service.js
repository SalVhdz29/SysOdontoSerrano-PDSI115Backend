'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../config');
const { DateTime } = require("luxon");

const createToken = user =>{
    var now = DateTime.now();
    const payload = {
        sub: user.ID_USUARIO, //id publico del usuario o el propio.
        nombre_usuario: user.NOMBRE_USUARIO,
        iat: now , // fecha de creación del token. params vacíos los crea hoy.
        exp: now.plus({days: 7}), // fecha de expiración del token.
    }

    return jwt.encode(payload, config.SECRET_TOKEN);
}

const _autorización_Recurso = async (id_recurso_solicitado, id_usuario) =>{
    try{
  
        console.log("ID USUARIO DE permiso", id_usuario);
        let usuario = await Entity.tbl_n_usuario.findByPk(id_usuario);

        console.log("EL USUARIO", usuario);

        //obteniendo el rol y permisos.
 
        const roles = await Entity.tbl_n_rol.findAll({
            where:{
                ID_USUARIO: usuario.ID_USUARIO
            }
        });

        let autorizado = false;
        //iterando para obtener los permisos.
        roles.map(async rol =>{
            let recursos_rol = await Entity.tbl_n_permiso.findAll({
                where:{
                    ID_USUARIO: rol.ID_F_USUARIO_ROL
                }
            });

            recursos_rol.map(recurso =>{
                
                if(recurso.ID_RECURSO == id_recurso_solicitado)
                {
                    autorizado = true;
                }
            })

        });
        
        console.log("EL PERMISO",  autorizado);

        
        
        if(autorizado && usuario.USUARIO_ACTIVO == 1)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    catch(e)
    {
        console.log(e);
        return false;
    }
}


module.exports = 
{
    createToken,
    _autorización_Recurso
};