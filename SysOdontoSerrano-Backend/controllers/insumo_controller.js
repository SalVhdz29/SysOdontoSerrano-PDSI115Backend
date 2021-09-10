
'use strict'
// importamos mediante require modelos y librerias necesarias.

//Conexión a BD.
const {sequelize} = require('../models/index.js');
//importamos modelo para usuarios.
let init_models= require("../models/init-models");

var Entity= init_models(sequelize); // inicialización de los modelos.


const _Nuevoinsumo = async(req, res) =>{

	var nombre = req.body.nombre_insumo;
	var descripcion = req.body.descripcion;
	var insumo_activo = req.body.insumo_activo;
	

    let insumo = await Entity.tbl_n_insumo.create({

        NOMBRE_INSUMO: nombre,
        DESCRIPCION_INSUMO: descripcion,
        INSUMO_ACTIVO: insumo_activo
    });

    res.status(200).send({message:"Se guardo insumo"});
}
const _Updateinsumo = async(req, res) =>{
    
    var nombre = req.body.nombre_insumo;
    var descripcion = req.body.descripcion;
    var id_insumo = req.body.id_insumo;
      
    const insumo = await Entity.tbl_n_insumo.findAll({
        where:{
            ID_INSUMO: id_insumo
        }
    });
   

    let insumo_r = await Entity.tbl_n_insumo.update(
        {
            NOMBRE_INSUMO: nombre,
            DESCRIPCION_INSUMO: descripcion
        },
        {
            where:{
                ID_INSUMO: id_insumo
            }
        });

    res.status(200).send({message:"Actualicion completada del servidor"});
}

const _Obtenerinsumo = async(req, res) =>{
    let insumo_consulta = await Entity.tbl_n_insumo.findAll({
    });

    let res_insumo = {};
    let res_insumos = [];

    for(let insumo of insumo_consulta){
        let id_insumo = insumo.ID_INSUMO;
        let nombre_insumo = insumo.NOMBRE_INSUMO;
        let descripcion = insumo.DESCRIPCION_INSUMO;
        
        res_insumo = {
            id_insumo,
            nombre_insumo,
            descripcion
        };
        res_insumos.push(res_insumo);
    }
    res.status(200).send(res_insumos);
}
const _ObtenerUninsumo = async(req, res) =>{
    let insumo_consulta = await Entity.tbl_n_insumo.findAll({
        where:{
            ID_INSUMO: 1
        }
    });
 
    res.status(200).send(insumo_consulta);
}

module.exports = {
    _Nuevoinsumo,
    _Updateinsumo,
    _Obtenerinsumo,
    _ObtenerUninsumo
}

