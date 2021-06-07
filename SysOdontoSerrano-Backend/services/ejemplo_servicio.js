'use strict' 

const servicio_de_prueba=(parametro_1, parametro_2)=>{
    try{
    let suma = parseInt(parametro_1) + parseInt(parametro_2);

    return suma;
    }
    catch(e)
    {
        return e;
    }

};

module.exports={
    servicio_de_prueba,
}