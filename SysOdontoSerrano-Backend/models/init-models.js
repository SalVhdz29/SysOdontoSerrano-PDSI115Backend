var DataTypes = require("sequelize").DataTypes;
var _permiso = require("./permiso");
var _tbl_n_recurso = require("./tbl_n_recurso");
var _tbl_n_rol = require("./tbl_n_rol");
var _tbl_n_tipo_recurso = require("./tbl_n_tipo_recurso");
var _tbl_n_tipo_usuario = require("./tbl_n_tipo_usuario");
var _tbl_n_usuario = require("./tbl_n_usuario");

function initModels(sequelize) {
  var permiso = _permiso(sequelize, DataTypes);
  var tbl_n_recurso = _tbl_n_recurso(sequelize, DataTypes);
  var tbl_n_rol = _tbl_n_rol(sequelize, DataTypes);
  var tbl_n_tipo_recurso = _tbl_n_tipo_recurso(sequelize, DataTypes);
  var tbl_n_tipo_usuario = _tbl_n_tipo_usuario(sequelize, DataTypes);
  var tbl_n_usuario = _tbl_n_usuario(sequelize, DataTypes);

  tbl_n_recurso.belongsToMany(tbl_n_usuario, { as: 'ID_USUARIO_tbl_n_usuarios', through: permiso, foreignKey: "ID_RECURSO", otherKey: "ID_USUARIO" });
  tbl_n_usuario.belongsToMany(tbl_n_recurso, { as: 'ID_RECURSO_tbl_n_recursos', through: permiso, foreignKey: "ID_USUARIO", otherKey: "ID_RECURSO" });
  permiso.belongsTo(tbl_n_recurso, { as: "ID_RECURSO_tbl_n_recurso", foreignKey: "ID_RECURSO"});
  tbl_n_recurso.hasMany(permiso, { as: "permisos", foreignKey: "ID_RECURSO"});
  tbl_n_recurso.belongsTo(tbl_n_tipo_recurso, { as: "ID_TIPO_RECURSO_tbl_n_tipo_recurso", foreignKey: "ID_TIPO_RECURSO"});
  tbl_n_tipo_recurso.hasMany(tbl_n_recurso, { as: "tbl_n_recursos", foreignKey: "ID_TIPO_RECURSO"});
  tbl_n_usuario.belongsTo(tbl_n_tipo_usuario, { as: "ID_TIPO_USUARIO_tbl_n_tipo_usuario", foreignKey: "ID_TIPO_USUARIO"});
  tbl_n_tipo_usuario.hasMany(tbl_n_usuario, { as: "tbl_n_usuarios", foreignKey: "ID_TIPO_USUARIO"});
  permiso.belongsTo(tbl_n_usuario, { as: "ID_USUARIO_tbl_n_usuario", foreignKey: "ID_USUARIO"});
  tbl_n_usuario.hasMany(permiso, { as: "permisos", foreignKey: "ID_USUARIO"});
  tbl_n_rol.belongsTo(tbl_n_usuario, { as: "ID_F_USUARIO_ROL_tbl_n_usuario", foreignKey: "ID_F_USUARIO_ROL"});
  tbl_n_usuario.hasMany(tbl_n_rol, { as: "tbl_n_rols", foreignKey: "ID_F_USUARIO_ROL"});
  tbl_n_rol.belongsTo(tbl_n_usuario, { as: "ID_USUARIO_tbl_n_usuario", foreignKey: "ID_USUARIO"});
  tbl_n_usuario.hasMany(tbl_n_rol, { as: "ID_USUARIO_tbl_n_rols", foreignKey: "ID_USUARIO"});

  return {
    permiso,
    tbl_n_recurso,
    tbl_n_rol,
    tbl_n_tipo_recurso,
    tbl_n_tipo_usuario,
    tbl_n_usuario,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
