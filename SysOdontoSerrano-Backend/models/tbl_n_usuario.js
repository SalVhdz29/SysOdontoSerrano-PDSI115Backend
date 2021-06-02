const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
 const tbl_n_usuario = sequelize.define('tbl_n_usuario', {
    ID_USUARIO: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ID_TIPO_USUARIO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tbl_n_tipo_usuario',
        key: 'ID_TIPO_USUARIO'
      }
    },
    ID_EMPLEADO: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_empleado',
        key: 'ID_EMPLEADO'
      }
    },
    NOMBRE_USUARIO: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    CORREO_ELECTRONICO_USUARIO: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    CONTRASENIA_USUARIO: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    FECHA_CREACION_USUARIO: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    FECHA_MODIFICACION_USUARIO: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    USUARIO_ACTIVO: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'tbl_n_usuario',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_USUARIO" },
        ]
      },
      {
        name: "FK_SE_CLASIFICA_POR",
        using: "BTREE",
        fields: [
          { name: "ID_TIPO_USUARIO" },
        ]
      },
      {
        name: "FK_TIENE_UN",
        using: "BTREE",
        fields: [
          { name: "ID_EMPLEADO" },
        ]
      },
    ]
  });

  tbl_n_usuario.prototype.generateHash=function (password) {
    return bcrypt.hash(password, 8, function(err, hash){
        if(err){
            console.log('error'+err)
        }else{
            return hash;
        }
    });
}

tbl_n_usuario.prototype.validPassword=function(password) {
  return bcrypt.compareSync(password, this.CONTRASENIA_USUARIO);
}        

  return tbl_n_usuario;
};
