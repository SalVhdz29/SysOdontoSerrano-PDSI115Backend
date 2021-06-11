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
const obtenerExpedientes=(pacientes,personas,detalle_personas,expedientes)=>{
let res_expediente = {};
let res_expedientes = [];

    for(let paciente of pacientes){
        for(let persona of personas){
        	for(let detalle_persona of detalle_personas){
        		for(let expediente of expedientes){
		        	if(paciente.ID_PERSONA == persona.ID_PERSONA){
		        		if(paciente.ID_PERSONA == detalle_persona.ID_PERSONA){
		        			if (paciente.ID_PACIENTE == expediente.ID_PACIENTE) {
		        				
		        					let id_expediente = expediente.ID_EXPEDIENTE;
						            let nombre_paciente = persona.NOMBRE_PERSONA;
						            let apellido_paciente = persona.APELLIDO_PERSONA;
						            let dui = detalle_persona.DUI;
						            let sexo =paciente.SEXO;
						            let correo = paciente.CORREO_ELECTRONICO_PACIENTE;
						            let telefono = detalle_persona.NUMERO_DE_CONTACTO;
						            let ultima_fecha = expediente.FECHA_CREACION_EXPEDIENTE;
						            let fecha_nacimiento = persona.FECHA_NACIMIENTO;
						            let direccion = detalle_persona.DIRECCION;

						            res_expediente = {
						            	id_expediente,
						            	nombre_paciente,
						            	apellido_paciente,
						            	dui,
						            	sexo,
						            	correo,
						            	telefono,
						            	ultima_fecha,
						            	fecha_nacimiento,
						            	direccion
		        				};
		        				res_expedientes.push(res_expediente);
		        			}
		        		}
        			}
        		}
        	}
        }
    }
	return res_expedientes;
}

module.exports={
    servicio_update_expediente,
    obtenerExpedientes,
}