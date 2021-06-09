'use strict'
// importamos mediante require modelos y librerias necesarias.

//Conexión a BD.
const {sequelize} = require('../models/index.js');
//importamos modelo para tiporecursos.
let init_models= require("../models/init-models");

var Entity= init_models(sequelize); // inicialización de los modelos.
//const { DateTime } = require("luxon");

//Servicios
const auth_service = require("../services/auth_service");

//obtiene la lista de tiporecurso registrados de tipo tiporecurso.




const tiporecurso_registrados = async(req, res)=>{

    try{

        //variables de Output.
        let lista_tiporecurso =[];

        const tipo_recurso_registrados = await Entity.tbl_n_tipo_recurso.findAll(
            /*{
            where:{
                TIPO_RECURSO_ACTIVO: 1
            }
        }*/
        );

       const recursos_registrados = await Entity.tbl_n_recurso.findAll({});

       console.log("TIPORECURSOS REGISTRADOS: ", tipo_recurso_registrados);


        if(tipo_recurso_registrados.length !=0)
        {
           // console.log("ENTRAMOS EN TIPORECURSOS_REGISTRADOS");
     
           // console.log("TIPORECURSOS REGISTRADOS: ", tipo_recurso_registrados);
            for(let tipo_recurso_r_it of tipo_recurso_registrados){

                let { ID_TIPO_RECURSO,                     
                    NOMBRE_TIPO_RECURSO,
                    DESCRIPCION_TIPO_RECURSO,
                    TIPO_RECURSO_ACTIVO
                    } = tipo_recurso_r_it;

                console.log("EL NOMBRE: ", NOMBRE_TIPO_RECURSO);

                let tipo_recurso_id = ID_TIPO_RECURSO;
                let tipo_recurso_nombre = NOMBRE_TIPO_RECURSO;                                
                let tipo_recurso_descripcion = DESCRIPCION_TIPO_RECURSO;
                let tipo_recurso_estado = TIPO_RECURSO_ACTIVO;               


                let recurso =[];
                let lista_recurso_a = await Entity.tbl_n_recurso.findAll({
                    where:{
                        ID_TIPO_RECURSO: tipo_recurso_id,                        
                    }
                });


                if(lista_recurso_a.length)
                {
                    for(let recurso_it of lista_recurso_a )
                    {
                        
            
                        let nombre_recurso = recurso_it.NOMBRE_RECURSO;
            
                        let id_recurso = recurso_it.ID_RECURSO;
        
                        let descripcion_recurso = recurso_it.DESCRIPCION_RECURSO;
        
                    //    let estado_recurso = resurso_it.RECURSO_ACTIVO;
            
                        let recurso_pivote={id_recurso, nombre_recurso, descripcion_recurso};
            
                        recurso.push(recurso_pivote);
                    }
        
                }

                let tipo_recurso_pivote = {
                                    tipo_recurso_id,
                                    tipo_recurso_nombre,
                                    tipo_recurso_descripcion,                                      
                                    tipo_recurso_estado,
                                    recurso
                                    };

                console.log("TIPORECURSO_PIVOTE: ", tipo_recurso_pivote);

                lista_tiporecurso.push(tipo_recurso_pivote);



            } // fin for tiporecurso_registrados.

        }





       // res.json(tipo_recurso_registrados)

        res.json(lista_tiporecurso)

        res.status(200).send(lista_tiporecurso);

    }
    catch(e)
    {
        console.log>("EL ERROR: ==> ",e);
        res.status(500).send({errorMessage:  "Ha ocurrido un error en el servidor."});
    }
}


//actualiza el valor de activo de un tiporecurso registrado.
const cambiar_estado_tiporecurso = async(req, res) =>{

    try{

        let { tipo_recurso_id } = req.body;


            let tipo_recurso = await Entity.tbl_n_tipo_recurso.findByPk(tipo_recurso_id);

            let tipo_recurso_activo = tipo_recurso.TIPO_RECURSO_ACTIVO;

            await Entity.tbl_n_tipo_recurso.update({ TIPO_RECURSO_ACTIVO: !tipo_recurso_activo },{
                where: {
                    ID_TIPO_RECURSO: tipo_recurso_id
                    }
                    });
            tipo_recurso = await Entity.tbl_n_tipo_recurso.findByPk(tipo_recurso_id);

            res.status(200).send({message:"OK"});

            res.json(tipo_recurso);
    
    }catch(e)
    {
        console.log>("EL ERROR: ==> ",e);
        res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."});
    }
}




// lista de recursosactivos
const recurso_activos  = async(req, res) =>{

    try{
        let lista_recurso =[];

        let lista_recurso_activos  = await Entity.tbl_n_recurso.findAll({
            where:{
                RECURSO_ACTIVO: 1
            }
        });

        if(lista_recurso_activos.length)
        {
            for(let recurso_it of lista_recurso_activos )
            {
                
    
                let nombre_recurso = recurso_it.NOMBRE_RECURSO;
    
                let id_recurso = recurso_it.ID_RECURSO;

                let descripcion_recurso = recurso_it.DESCRIPCION_RECURSO;

            //    let estado_recurso = resurso_it.RECURSO_ACTIVO;
    
                let recurso_pivote={id_recurso, nombre_recurso, descripcion_recurso};
    
                lista_recurso.push(recurso_pivote);
            }

        }




        console.log("RECURSOS: ", lista_recurso);


        res.json(lista_recurso)
        res.status(200).send({message:"OK"});


    }catch(e)
    {
        console.log(e);
        res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."});
    }
}

//creacion de un nuevo tiporecurso.
const crear_tipo_recurso = async(req, res) =>{

    try{

        const tiporecurso_new = req.body;
        let {
            tipo_recurso_nombre,  
            tipo_recurso_descripcion,          
            tipo_recurso_estado,
            recurso,            
        } = req.body;

        console.log("lo obtenido: ", req.body);
        

        let tipo_recurso = await Entity.tbl_n_tipo_recurso.findByPk(1);

        //creando nuevo TipoRecurso.
        let nuevo_tipo_recurso = await Entity.tbl_n_tipo_recurso.create({
            NOMBRE_TIPO_RECURSO: tipo_recurso_nombre,   
            DESCRIPCION_TIPO_RECURSO: tipo_recurso_descripcion,         
            TIPO_RECURSO_ACTIVO: tipo_recurso_estado
        });

        let id_tipo_recurso_creado = nuevo_tipo_recurso.ID_TIPO_RECURSO;
        console.log("ID_TIPO_RECURSO: ", id_tipo_recurso_creado);
        
        //relacionando recursos con el tiporecurso.

        console.log("RECURSOS: ", recurso);


/*ACTUALIZANDO LOS RECURSOS ASOCIADOS AL NUEVO TIPO RECURSO CREADO*/ 

        if(recurso.length != 0)
        {

                for(let recurso_it of recurso)
                {
                    console.log("RECURSO IT: ", recurso_it);

                    let recurso_creado = await Entity.tbl_n_recurso.update({                        
                        ID_TIPO_RECURSO: id_tipo_recurso_creado                        
                    },{
                    where: {
                        ID_RECURSO: recurso_it.id_recurso                       
                      }}
                    );                    
                    
                }
        }
        res.status(200).send({message:"OK"});
        res.json(tiporecurso_new)




    }catch(e)
    {
        console.log(e);
        res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."});
    }
}

//actualizar datos de tiporecurso.

const actualizar_recurso =async(req, res) =>{

    try{

        let {
            tipo_recurso_id,
            tipo_recurso_nombre,     
            tipo_recurso_descripcion,       
            tipo_recurso_estado,
            recurso            
        } = req.body;

        console.log("LO OBTENIDO: ", req.body);

        
        let tipo_recurso=null;
        //actualización de tiporecurso.

            tipo_recurso = await Entity.tbl_n_tipo_recurso.update({
                NOMBRE_TIPO_RECURSO: tipo_recurso_nombre,      
                DESCRIPCION_TIPO_RECURSO: tipo_recurso_descripcion,          
                TIPO_RECURSO_ACTIVO: tipo_recurso_estado
            },{where:{
                ID_TIPO_RECURSO: tipo_recurso_id
            }});

            let id_tipo_recurso_creado =  tipo_recurso_id;

        console.log("idtipo actualizar: ", id_tipo_recurso_creado);
            

/*ACTUALIZANDO LOS RECURSOS ASOCIADOS AL TIPO RECURSO ACTUALIZADO*/ 

if(recurso.length != 0)
{

        for(let recurso_it of recurso)
        {
            console.log("RECURSO IT: ", recurso_it);

            let recurso_creado = await Entity.tbl_n_recurso.update({                        
                ID_TIPO_RECURSO: id_tipo_recurso_creado                        
            },{
            where: {
                ID_RECURSO: recurso_it.id_recurso                       
            }}
            );                    
            
        }
}


//res.json(recurso)
res.status(200).send({message:"OK"});




    }catch(e)
    {
        console.log(e);
        res.status(500).send({errorMessage: "Ha ocurrido un error en el servidor."});
    }

}

module.exports={
    tiporecurso_registrados,
    cambiar_estado_tiporecurso,
    //tipo_recurso_recurso,    
    crear_tipo_recurso,
    actualizar_recurso,
    recurso_activos
}