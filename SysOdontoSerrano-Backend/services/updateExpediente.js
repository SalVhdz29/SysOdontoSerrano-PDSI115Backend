'use strict' 

const servicio_update_expediente=(correo, activo, contacto, direccion,paciente,detalle_persona)=>{
   
   		var Campos = new Object();
        Campos['correo'] = true;
        Campos['activo'] = true;
        Campos['contacto'] = true;
        Campos['direccion'] = true;

	if(correo == paciente.CORREO_ELECTRONICO_PACIENTE){
		Campos['correo'] = false;
	}
	if (activo == paciente.PACIENTE_ACTIVO) {
		Campos['activo'] = false;
	}
	if(contacto == detalle_persona.NUMERO_DE_CONTACTO){
		Campos['contacto'] = false;
	}
	if (direccion == detalle_persona.DIRECCION){
		Campos['activo'] = false;
	}
    return Campos;
};

module.exports={
    servicio_update_expediente,
}