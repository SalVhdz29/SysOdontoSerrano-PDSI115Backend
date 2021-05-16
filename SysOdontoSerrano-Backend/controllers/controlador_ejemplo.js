'use strict'
// importamos mediante require modelos y librerias necesarias.

const ejemplo_servicio = require("../services/ejemplo_servicio");

const saludoMundo=(req, res)=>{
    res.send(200, { message:"Hola Mundo!!"});
}

const saludoPersonalizado =(req, res)=>{
    
    //let datosEnviados = req.body son los que vienen de un POST.
    res.send(200, {message:`Hola ${req.params.nombre}`});
    //status y JSON de datos a enviar.
    //let datosAEnviar = {message: `Hola ${req.params.nombre}`};
    //res.send(200, datosAEnviar);
}

const sumaParametros=(req, res)=>{
    // let parametro_1 = req.params.parametro_1;
    // let parametro_2 = req.params.parametro_2;

    let { parametro_1, parametro_2} = req.params;
    console.log(parametro_1, parametro_2);

    let resultado = ejemplo_servicio.servicio_de_prueba(parametro_1, parametro_2);

    res.send(200, {resultado});
}

module.exports={
    saludoMundo,
    saludoPersonalizado,
    sumaParametros
}