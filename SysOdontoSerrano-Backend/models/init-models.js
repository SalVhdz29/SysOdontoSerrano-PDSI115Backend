var DataTypes = require("sequelize").DataTypes;
var _permiso = require("./permiso");
var _tb_n_pago_sesion = require("./tb_n_pago_sesion");
var _tbl_n_cotizacion = require("./tbl_n_cotizacion");
var _tbl_n_cotizacion_servicio = require("./tbl_n_cotizacion_servicio");
var _tbl_n_cuadrante = require("./tbl_n_cuadrante");
var _tbl_n_detalle_persona = require("./tbl_n_detalle_persona");
var _tbl_n_empleado = require("./tbl_n_empleado");
var _tbl_n_estado_pieza = require("./tbl_n_estado_pieza");
var _tbl_n_estado_seccion = require("./tbl_n_estado_seccion");
var _tbl_n_estado_sesion = require("./tbl_n_estado_sesion");
var _tbl_n_expediente = require("./tbl_n_expediente");
var _tbl_n_ficha_clinica = require("./tbl_n_ficha_clinica");
var _tbl_n_insumo = require("./tbl_n_insumo");
var _tbl_n_lote = require("./tbl_n_lote");
var _tbl_n_paciente = require("./tbl_n_paciente");
var _tbl_n_persona = require("./tbl_n_persona");
var _tbl_n_pieza = require("./tbl_n_pieza");
var _tbl_n_pieza_paciente = require("./tbl_n_pieza_paciente");
var _tbl_n_recurso = require("./tbl_n_recurso");
var _tbl_n_rol = require("./tbl_n_rol");
var _tbl_n_saldo = require("./tbl_n_saldo");
var _tbl_n_servicio = require("./tbl_n_servicio");
var _tbl_n_servicio_insumo = require("./tbl_n_servicio_insumo");
var _tbl_n_servicio_pago = require("./tbl_n_servicio_pago");
var _tbl_n_sesion = require("./tbl_n_sesion");
var _tbl_n_tipo_pago = require("./tbl_n_tipo_pago");
var _tbl_n_tipo_recurso = require("./tbl_n_tipo_recurso");
var _tbl_n_tipo_usuario = require("./tbl_n_tipo_usuario");
var _tbl_n_transaccion_insumo = require("./tbl_n_transaccion_insumo");
var _tbl_n_usuario = require("./tbl_n_usuario");

function initModels(sequelize) {
  var permiso = _permiso(sequelize, DataTypes);
  var tb_n_pago_sesion = _tb_n_pago_sesion(sequelize, DataTypes);
  var tbl_n_cotizacion = _tbl_n_cotizacion(sequelize, DataTypes);
  var tbl_n_cotizacion_servicio = _tbl_n_cotizacion_servicio(sequelize, DataTypes);
  var tbl_n_cuadrante = _tbl_n_cuadrante(sequelize, DataTypes);
  var tbl_n_detalle_persona = _tbl_n_detalle_persona(sequelize, DataTypes);
  var tbl_n_empleado = _tbl_n_empleado(sequelize, DataTypes);
  var tbl_n_estado_pieza = _tbl_n_estado_pieza(sequelize, DataTypes);
  var tbl_n_estado_seccion = _tbl_n_estado_seccion(sequelize, DataTypes);
  var tbl_n_estado_sesion = _tbl_n_estado_sesion(sequelize, DataTypes);
  var tbl_n_expediente = _tbl_n_expediente(sequelize, DataTypes);
  var tbl_n_ficha_clinica = _tbl_n_ficha_clinica(sequelize, DataTypes);
  var tbl_n_insumo = _tbl_n_insumo(sequelize, DataTypes);
  var tbl_n_lote = _tbl_n_lote(sequelize, DataTypes);
  var tbl_n_paciente = _tbl_n_paciente(sequelize, DataTypes);
  var tbl_n_persona = _tbl_n_persona(sequelize, DataTypes);
  var tbl_n_pieza = _tbl_n_pieza(sequelize, DataTypes);
  var tbl_n_pieza_paciente = _tbl_n_pieza_paciente(sequelize, DataTypes);
  var tbl_n_recurso = _tbl_n_recurso(sequelize, DataTypes);
  var tbl_n_rol = _tbl_n_rol(sequelize, DataTypes);
  var tbl_n_saldo = _tbl_n_saldo(sequelize, DataTypes);
  var tbl_n_servicio = _tbl_n_servicio(sequelize, DataTypes);
  var tbl_n_servicio_insumo = _tbl_n_servicio_insumo(sequelize, DataTypes);
  var tbl_n_servicio_pago = _tbl_n_servicio_pago(sequelize, DataTypes);
  var tbl_n_sesion = _tbl_n_sesion(sequelize, DataTypes);
  var tbl_n_tipo_pago = _tbl_n_tipo_pago(sequelize, DataTypes);
  var tbl_n_tipo_recurso = _tbl_n_tipo_recurso(sequelize, DataTypes);
  var tbl_n_tipo_usuario = _tbl_n_tipo_usuario(sequelize, DataTypes);
  var tbl_n_transaccion_insumo = _tbl_n_transaccion_insumo(sequelize, DataTypes);
  var tbl_n_usuario = _tbl_n_usuario(sequelize, DataTypes);

  tbl_n_recurso.belongsToMany(tbl_n_usuario, { as: 'ID_USUARIO_tbl_n_usuarios', through: permiso, foreignKey: "ID_RECURSO", otherKey: "ID_USUARIO" });
  tbl_n_usuario.belongsToMany(tbl_n_recurso, { as: 'ID_RECURSO_tbl_n_recursos', through: permiso, foreignKey: "ID_USUARIO", otherKey: "ID_RECURSO" });
  tbl_n_usuario.belongsToMany(tbl_n_usuario, { as: 'ID_USUARIO_tbl_n_usuario_tbl_n_rols', through: tbl_n_rol, foreignKey: "ID_ROL", otherKey: "ID_USUARIO" });
  tbl_n_usuario.belongsToMany(tbl_n_usuario, { as: 'ID_ROL_tbl_n_usuarios', through: tbl_n_rol, foreignKey: "ID_USUARIO", otherKey: "ID_ROL" });
  tbl_n_servicio_pago.belongsTo(tb_n_pago_sesion, { as: "ID_PAGO_SESION_tb_n_pago_sesion", foreignKey: "ID_PAGO_SESION"});
  tb_n_pago_sesion.hasMany(tbl_n_servicio_pago, { as: "tbl_n_servicio_pagos", foreignKey: "ID_PAGO_SESION"});
  tbl_n_transaccion_insumo.belongsTo(tb_n_pago_sesion, { as: "ID_F_PAGO_SESION_tb_n_pago_sesion", foreignKey: "ID_F_PAGO_SESION"});
  tb_n_pago_sesion.hasMany(tbl_n_transaccion_insumo, { as: "tbl_n_transaccion_insumos", foreignKey: "ID_F_PAGO_SESION"});
  tbl_n_cotizacion_servicio.belongsTo(tbl_n_cotizacion, { as: "ID_F_COTIZACION_tbl_n_cotizacion", foreignKey: "ID_F_COTIZACION"});
  tbl_n_cotizacion.hasMany(tbl_n_cotizacion_servicio, { as: "tbl_n_cotizacion_servicios", foreignKey: "ID_F_COTIZACION"});
  tbl_n_pieza.belongsTo(tbl_n_cuadrante, { as: "ID_F_CUADRANTE_tbl_n_cuadrante", foreignKey: "ID_F_CUADRANTE"});
  tbl_n_cuadrante.hasMany(tbl_n_pieza, { as: "tbl_n_piezas", foreignKey: "ID_F_CUADRANTE"});
  tbl_n_usuario.belongsTo(tbl_n_empleado, { as: "ID_EMPLEADO_tbl_n_empleado", foreignKey: "ID_EMPLEADO"});
  tbl_n_empleado.hasMany(tbl_n_usuario, { as: "tbl_n_usuarios", foreignKey: "ID_EMPLEADO"});
  tbl_n_pieza_paciente.belongsTo(tbl_n_estado_pieza, { as: "ID_F_ESTADO_PIEZA_tbl_n_estado_pieza", foreignKey: "ID_F_ESTADO_PIEZA"});
  tbl_n_estado_pieza.hasMany(tbl_n_pieza_paciente, { as: "tbl_n_pieza_pacientes", foreignKey: "ID_F_ESTADO_PIEZA"});
  tbl_n_pieza_paciente.belongsTo(tbl_n_estado_seccion, { as: "SD_ID_F_ESTADO_SECCION_tbl_n_estado_seccion", foreignKey: "SD_ID_F_ESTADO_SECCION"});
  tbl_n_estado_seccion.hasMany(tbl_n_pieza_paciente, { as: "tbl_n_pieza_pacientes", foreignKey: "SD_ID_F_ESTADO_SECCION"});
  tbl_n_pieza_paciente.belongsTo(tbl_n_estado_seccion, { as: "SI_ID_F_ESTADO_SECCION_tbl_n_estado_seccion", foreignKey: "SI_ID_F_ESTADO_SECCION"});
  tbl_n_estado_seccion.hasMany(tbl_n_pieza_paciente, { as: "SI_ID_F_ESTADO_SECCION_tbl_n_pieza_pacientes", foreignKey: "SI_ID_F_ESTADO_SECCION"});
  tbl_n_pieza_paciente.belongsTo(tbl_n_estado_seccion, { as: "ID_ID_F_ESTADO_SECCION2_tbl_n_estado_seccion", foreignKey: "ID_ID_F_ESTADO_SECCION2"});
  tbl_n_estado_seccion.hasMany(tbl_n_pieza_paciente, { as: "ID_ID_F_ESTADO_SECCION2_tbl_n_pieza_pacientes", foreignKey: "ID_ID_F_ESTADO_SECCION2"});
  tbl_n_pieza_paciente.belongsTo(tbl_n_estado_seccion, { as: "II_ID_F_ESTADO_SECCION3_tbl_n_estado_seccion", foreignKey: "II_ID_F_ESTADO_SECCION3"});
  tbl_n_estado_seccion.hasMany(tbl_n_pieza_paciente, { as: "II_ID_F_ESTADO_SECCION3_tbl_n_pieza_pacientes", foreignKey: "II_ID_F_ESTADO_SECCION3"});
  tbl_n_pieza_paciente.belongsTo(tbl_n_estado_seccion, { as: "LC_ID_F_ESTADO_SECCION_tbl_n_estado_seccion", foreignKey: "LC_ID_F_ESTADO_SECCION"});
  tbl_n_estado_seccion.hasMany(tbl_n_pieza_paciente, { as: "LC_ID_F_ESTADO_SECCION_tbl_n_pieza_pacientes", foreignKey: "LC_ID_F_ESTADO_SECCION"});
  tbl_n_sesion.belongsTo(tbl_n_estado_sesion, { as: "ID_F_ESTADO_SESION_tbl_n_estado_sesion", foreignKey: "ID_F_ESTADO_SESION"});
  tbl_n_estado_sesion.hasMany(tbl_n_sesion, { as: "tbl_n_sesions", foreignKey: "ID_F_ESTADO_SESION"});
  tbl_n_cotizacion.belongsTo(tbl_n_expediente, { as: "ID_EXPEDIENTE_tbl_n_expediente", foreignKey: "ID_EXPEDIENTE"});
  tbl_n_expediente.hasMany(tbl_n_cotizacion, { as: "tbl_n_cotizacions", foreignKey: "ID_EXPEDIENTE"});
  tbl_n_ficha_clinica.belongsTo(tbl_n_expediente, { as: "ID_F_EXPEDIENTE_tbl_n_expediente", foreignKey: "ID_F_EXPEDIENTE"});
  tbl_n_expediente.hasMany(tbl_n_ficha_clinica, { as: "tbl_n_ficha_clinicas", foreignKey: "ID_F_EXPEDIENTE"});
  tbl_n_saldo.belongsTo(tbl_n_expediente, { as: "ID_F_EXPEDIENTE_tbl_n_expediente", foreignKey: "ID_F_EXPEDIENTE"});
  tbl_n_expediente.hasMany(tbl_n_saldo, { as: "tbl_n_saldos", foreignKey: "ID_F_EXPEDIENTE"});
  tbl_n_sesion.belongsTo(tbl_n_expediente, { as: "ID_EXPEDIENTE_tbl_n_expediente", foreignKey: "ID_EXPEDIENTE"});
  tbl_n_expediente.hasMany(tbl_n_sesion, { as: "tbl_n_sesions", foreignKey: "ID_EXPEDIENTE"});
  tbl_n_pieza_paciente.belongsTo(tbl_n_ficha_clinica, { as: "ID_F_FICHA_CLINICA_tbl_n_ficha_clinica", foreignKey: "ID_F_FICHA_CLINICA"});
  tbl_n_ficha_clinica.hasMany(tbl_n_pieza_paciente, { as: "tbl_n_pieza_pacientes", foreignKey: "ID_F_FICHA_CLINICA"});
  tbl_n_lote.belongsTo(tbl_n_insumo, { as: "ID_F_INSUMO_tbl_n_insumo", foreignKey: "ID_F_INSUMO"});
  tbl_n_insumo.hasMany(tbl_n_lote, { as: "tbl_n_lotes", foreignKey: "ID_F_INSUMO"});
  tbl_n_servicio_insumo.belongsTo(tbl_n_insumo, { as: "ID_F_INSUMO_tbl_n_insumo", foreignKey: "ID_F_INSUMO"});
  tbl_n_insumo.hasMany(tbl_n_servicio_insumo, { as: "tbl_n_servicio_insumos", foreignKey: "ID_F_INSUMO"});
  tbl_n_transaccion_insumo.belongsTo(tbl_n_lote, { as: "ID_LOTE_tbl_n_lote", foreignKey: "ID_LOTE"});
  tbl_n_lote.hasMany(tbl_n_transaccion_insumo, { as: "tbl_n_transaccion_insumos", foreignKey: "ID_LOTE"});
  tbl_n_expediente.belongsTo(tbl_n_paciente, { as: "ID_PACIENTE_tbl_n_paciente", foreignKey: "ID_PACIENTE"});
  tbl_n_paciente.hasMany(tbl_n_expediente, { as: "tbl_n_expedientes", foreignKey: "ID_PACIENTE"});
  tbl_n_detalle_persona.belongsTo(tbl_n_persona, { as: "ID_PERSONA_tbl_n_persona", foreignKey: "ID_PERSONA"});
  tbl_n_persona.hasMany(tbl_n_detalle_persona, { as: "tbl_n_detalle_personas", foreignKey: "ID_PERSONA"});
  tbl_n_empleado.belongsTo(tbl_n_persona, { as: "ID_PERSONA_tbl_n_persona", foreignKey: "ID_PERSONA"});
  tbl_n_persona.hasMany(tbl_n_empleado, { as: "tbl_n_empleados", foreignKey: "ID_PERSONA"});
  tbl_n_paciente.belongsTo(tbl_n_persona, { as: "ID_PERSONA_tbl_n_persona", foreignKey: "ID_PERSONA"});
  tbl_n_persona.hasMany(tbl_n_paciente, { as: "tbl_n_pacientes", foreignKey: "ID_PERSONA"});
  tbl_n_pieza_paciente.belongsTo(tbl_n_pieza, { as: "ID_F_PIEZA_tbl_n_pieza", foreignKey: "ID_F_PIEZA"});
  tbl_n_pieza.hasMany(tbl_n_pieza_paciente, { as: "tbl_n_pieza_pacientes", foreignKey: "ID_F_PIEZA"});
  permiso.belongsTo(tbl_n_recurso, { as: "ID_RECURSO_tbl_n_recurso", foreignKey: "ID_RECURSO"});
  tbl_n_recurso.hasMany(permiso, { as: "permisos", foreignKey: "ID_RECURSO"});
  tbl_n_cotizacion_servicio.belongsTo(tbl_n_servicio, { as: "ID_F_SERVICIO_tbl_n_servicio", foreignKey: "ID_F_SERVICIO"});
  tbl_n_servicio.hasMany(tbl_n_cotizacion_servicio, { as: "tbl_n_cotizacion_servicios", foreignKey: "ID_F_SERVICIO"});
  tbl_n_servicio_insumo.belongsTo(tbl_n_servicio, { as: "ID_F_SERVICIO_tbl_n_servicio", foreignKey: "ID_F_SERVICIO"});
  tbl_n_servicio.hasMany(tbl_n_servicio_insumo, { as: "tbl_n_servicio_insumos", foreignKey: "ID_F_SERVICIO"});
  tbl_n_servicio_pago.belongsTo(tbl_n_servicio, { as: "ID_SERVICIO_tbl_n_servicio", foreignKey: "ID_SERVICIO"});
  tbl_n_servicio.hasMany(tbl_n_servicio_pago, { as: "tbl_n_servicio_pagos", foreignKey: "ID_SERVICIO"});
  tbl_n_sesion.belongsTo(tbl_n_servicio, { as: "ID_SERVICIO_tbl_n_servicio", foreignKey: "ID_SERVICIO"});
  tbl_n_servicio.hasMany(tbl_n_sesion, { as: "tbl_n_sesions", foreignKey: "ID_SERVICIO"});
  tb_n_pago_sesion.belongsTo(tbl_n_sesion, { as: "ID_F_SESION_tbl_n_sesion", foreignKey: "ID_F_SESION"});
  tbl_n_sesion.hasMany(tb_n_pago_sesion, { as: "tb_n_pago_sesions", foreignKey: "ID_F_SESION"});
  tb_n_pago_sesion.belongsTo(tbl_n_tipo_pago, { as: "ID_TIPO_PAGO_tbl_n_tipo_pago", foreignKey: "ID_TIPO_PAGO"});
  tbl_n_tipo_pago.hasMany(tb_n_pago_sesion, { as: "tb_n_pago_sesions", foreignKey: "ID_TIPO_PAGO"});
  tbl_n_recurso.belongsTo(tbl_n_tipo_recurso, { as: "ID_TIPO_RECURSO_tbl_n_tipo_recurso", foreignKey: "ID_TIPO_RECURSO"});
  tbl_n_tipo_recurso.hasMany(tbl_n_recurso, { as: "tbl_n_recursos", foreignKey: "ID_TIPO_RECURSO"});
  tbl_n_usuario.belongsTo(tbl_n_tipo_usuario, { as: "ID_TIPO_USUARIO_tbl_n_tipo_usuario", foreignKey: "ID_TIPO_USUARIO"});
  tbl_n_tipo_usuario.hasMany(tbl_n_usuario, { as: "tbl_n_usuarios", foreignKey: "ID_TIPO_USUARIO"});
  permiso.belongsTo(tbl_n_usuario, { as: "ID_USUARIO_tbl_n_usuario", foreignKey: "ID_USUARIO"});
  tbl_n_usuario.hasMany(permiso, { as: "permisos", foreignKey: "ID_USUARIO"});
  tbl_n_rol.belongsTo(tbl_n_usuario, { as: "ID_ROL_tbl_n_usuario", foreignKey: "ID_ROL"});
  tbl_n_usuario.hasMany(tbl_n_rol, { as: "tbl_n_rols", foreignKey: "ID_ROL"});
  tbl_n_rol.belongsTo(tbl_n_usuario, { as: "ID_USUARIO_tbl_n_usuario", foreignKey: "ID_USUARIO"});
  tbl_n_usuario.hasMany(tbl_n_rol, { as: "ID_USUARIO_tbl_n_rols", foreignKey: "ID_USUARIO"});

  return {
    permiso,
    tb_n_pago_sesion,
    tbl_n_cotizacion,
    tbl_n_cotizacion_servicio,
    tbl_n_cuadrante,
    tbl_n_detalle_persona,
    tbl_n_empleado,
    tbl_n_estado_pieza,
    tbl_n_estado_seccion,
    tbl_n_estado_sesion,
    tbl_n_expediente,
    tbl_n_ficha_clinica,
    tbl_n_insumo,
    tbl_n_lote,
    tbl_n_paciente,
    tbl_n_persona,
    tbl_n_pieza,
    tbl_n_pieza_paciente,
    tbl_n_recurso,
    tbl_n_rol,
    tbl_n_saldo,
    tbl_n_servicio,
    tbl_n_servicio_insumo,
    tbl_n_servicio_pago,
    tbl_n_sesion,
    tbl_n_tipo_pago,
    tbl_n_tipo_recurso,
    tbl_n_tipo_usuario,
    tbl_n_transaccion_insumo,
    tbl_n_usuario,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
