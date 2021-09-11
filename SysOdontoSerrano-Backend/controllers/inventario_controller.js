'use strict' 
// importamos mediante require modelos y librerias necesarias. 
 
//Conexión a BD. 
const {sequelize} = require('../models/index.js'); 
//importamos modelo para lotes. 
let init_models= require("../models/init-models"); 
 
var Entity= init_models(sequelize); // inicialización de los modelos. 
const { DateTime } = require("luxon"); 

//Servicios 
const auth_service = require("../services/auth_service"); 

//Obtiene la lista de los insumos y sus existencias (Por conveniencia le llamaremos tabla_inventario)
const tabla_inventario = async(req, res)=>{

    try{ 
 
        //variables de Output. 
        let lista_lotes =[];
 
        const tabla_inventario = await Entity.tbl_n_lote.findAll({}); 
 
        if(tabla_inventario.length !=0) 
        { 
           // console.log("ENTRAMOS EN TABLA_INVENTARIO"); 

           // console.log("LOTES REGISTRADOS: ", tabla_inventario); 
            for(let lote_r_it of tabla_inventario){ 
                 

                   let { ID_F_INSUMO,
                   CANTIDAD_ACTUAL
                   } = lote_r_it;

              // console.log("LA CANTIDAD: ", CANTIDAD_ACTUAL); 

               let n_insumo = ID_F_INSUMO; 
               let existencia_insumo = CANTIDAD_ACTUAL; 

               let nombre_insumo = await Entity.tbl_n_insumo.findAll({ 
                   where:{ 
                       ID_INSUMO: n_insumo, 
                   } 
               }); 

              // console.log("NOMBRE DEL INSUMO: ", nombre_insumo); 

                                    let lote_pivote = {n_insumo, 
                                        nombre_insumo,   
                                        existencia_insumo
                                       };

             //  console.log("LOTE_PIVOTE: ", lote_pivote); 

               lista_lotes.push(lote_pivote); 

           } // fin for tabla_inventario 
       } 
       console.log("")
       res.status(200).send(lista_lotes); 

   }
    catch{
    //console.log>("EL ERROR: ==> ",e); 
    res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."}); 
    } 
}

    //Obtiene la lista de los lotes registrados
const tabla_historial = async(req, res)=>{

        try{ 
 
            //variables de Output. 
            let lista_historial =[];
 
            const tabla_historial = await Entity.tbl_n_lote.findAll({}); 
 
            if(tabla_historial.length !=0) 
            { 
                // console.log("ENTRAMOS EN TABLA_HISTORIAL"); 

                // console.log("HISTORIAL DE LOTES REGISTRADOS: ", tabla_historial); 
                for(let lote_r_it of tabla_historial){ 
                 

                   let { ID_LOTE,
                   CANTIDAD_LOTE,
                   FECHA_VENCIMIENTO
                   } = lote_r_it;

                    // console.log("LA CANTIDAD: ", CANTIDAD_LOTE); 

                    let n_lote = ID_LOTE; 
                    let existencia_lote = CANTIDAD_LOTE;
                    let fecha_lote = FECHA_VENCIMIENTO; 


                    let lote_pivote = {
                        n_lote, 
                        existencia_lote,   
                        fecha_lote
                                    };

                    //  console.log("LOTE_PIVOTE: ", lote_pivote); 

               lista_historial.push(lote_pivote); 

                } // fin for tabla_historial
            } 
        console.log("")
        res.status(200).send(lista_historial); 

        }
    catch{
        //console.log>("EL ERROR: ==> ",e); 
        res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."}); 
        } 
    }


    //Creacion de un nuevo lote
const crear_lote = async(req, res)=>{

        try{

            let {
                fecha_lote,
                costo_lote,
                cantidad_lote,
                precio_lote
            } = req.body;

            //console.log("lo obtenido: ", req.body);

            //Creando nuevo lote
            let nuevo_lote = await Entity.tbl_n_lote.create({
                FECHA_VENCIMIENTO: fecha_lote,
                COSTO_LOTE: costo_lote,
                CANTIDAD_LOTE: cantidad_lote,
                PRECIO_EFECTIVO: precio_lote
            });

            let id_lote_creado = nuevo_lote.ID_LOTE;
           // console.log("ID_LOTE_CREADO: ", id_lote_creado);


           // console.log("LLEGO AL FINAL");
              res.status(200).send({message:"OK"});            
        }
        catch{
           // console.log("EL ERROR: ",e); 
            res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."});
        }
    }

module.exports={
    tabla_inventario,
    tabla_historial,
    crear_lote
}
